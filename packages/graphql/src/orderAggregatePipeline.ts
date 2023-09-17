// TODO - treat when there's more than one $match
export function orderAggregatePipeline(
  pipeline: Record<string, unknown>[],
): Record<string, unknown>[] {
  if (!pipeline.length) {
    return [];
  }

  const geoNearStage = pipeline.find((stage) => !!stage.$geoNear);

  let orderedPipeline: Record<string, unknown>[] = [];
  let conditions = {};
  for (const stage of pipeline) {
    // if the stage is geoNear put it as first of the pipeline
    if (stage.$geoNear) {
      orderedPipeline = [stage, ...orderedPipeline];
      continue;
    }

    // store the first appearing $match on conditions
    // discard it from the ordered pipeline
    if (stage.$match) {
      if (geoNearStage && Object.keys(conditions).length === 0) {
        conditions = { ...conditions, ...stage.$match };
        continue;
      }
    }

    orderedPipeline = [...orderedPipeline, stage];
  }

  // add conditions on query of $geoNear
  if (geoNearStage) {
    geoNearStage.$geoNear.query = {
      ...(geoNearStage.$geoNear.query || {}),
      ...conditions,
    };
  }

  return orderedPipeline;
}
