#!/usr/bin/env bash

init_package() {
  local package_name=$1
  local root_dir="$(pwd)"
  local package="$root_dir/packages/$package_name"

  echo $root_dir $package_name $package

  mkdir -p $package

  cp -r $root_dir/packages/null/* $package/.

  cat $package/package.json | sed -i '' "s/null/$package_name/g" $package/package.json
}

init_package $1
