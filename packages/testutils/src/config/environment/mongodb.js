const fs = require('fs');
const path = require('path');

const { TestEnvironment } = require('jest-environment-node');
const { v4: uuidv4 } = require('uuid');

const cwd = process.cwd();

const globalConfigPath = path.join(cwd, 'globalConfig.json');

class MongoDbEnvironment extends TestEnvironment {
  constructor({globalConfig, projectConfig}, context) {
    super({globalConfig, projectConfig}, context);
    const config = projectConfig;
  }

  async setup() {
    await super.setup();

    const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));

    this.global.__MONGO_URI__ = globalConfig.mongoUri;
    this.global.__MONGO_DB_NAME__ = uuidv4();

    this.global.__COUNTERS__ = {
      user: 0,
      company: 0,
      companyFeedbackTopic: 0,
      industry: 0,
      jobPosting: 0,
      group: 0,
      groupFeedback: 0,
      userFeedback: 0,
      userFeedbackRequest: 0,
      complaintSubject: 0,
      file: 0,
      complaintAction: 0,
      roleGroup: 0,
      candidate: 0,
      candidateDependent: 0,
      jobRole: 0,
      costRevenueCenter: 0,
      businessDivision: 0,
      salaryRange: 0,
      jobExam: 0,
      jobExamQuestion: 0,
      goalGroup: 0,
      goal: 0,
      questionOption: 0,
      hiringReferral: 0,
      groupInterview: 0,
      groupInterviewRoom: 0,
      positionApplicationStatus: 0,
      complaintExternalAuthorData: 0,
      customEmoji: 0,
      performanceReview: 0,
      poll: 0,
      pollQuestion: 0,
      pollOption: 0,
      comment: 0,
      address: 0,
      application: 0,
      headCount: 0,
      rowNumber: 0,
      reviewTopic: 0,
    };
  }

  async teardown() {
    await super.teardown();
    this.global = {};
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoDbEnvironment;
