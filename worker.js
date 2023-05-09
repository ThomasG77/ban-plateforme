#!/usr/bin/env node

import 'dotenv/config.js' // eslint-disable-line import/no-unassigned-import
import ms from 'ms'

import apiConsumer from './lib/api/consumers/api-consumer.js'
import cleanJobStatusConsumer from './lib/api/consumers/clean-job-status-consumer.js'

import mongo from './lib/util/mongo.cjs'
import queue from './lib/util/queue.cjs'
import composeCommune from './lib/jobs/compose-commune.cjs'
import computeBanStats from './lib/jobs/compute-ban-stats.cjs'
import balGarbageCollector from './lib/compose/bal-garbage-collector/index.js'

async function main() {
  await mongo.connect()

  if (process.env.NODE_ENV === 'production') {
    // Garbage collector
    await balGarbageCollector()
  }

  // Legacy
  queue('compose-commune').process(2, composeCommune)
  queue('compute-ban-stats').process(1, computeBanStats)
  queue('compute-ban-stats').add({}, {jobId: 'computeBanStatsJobId', repeat: {every: ms('15m')}, removeOnComplete: true})

  // BanID
  queue('api').process(1, apiConsumer)
  queue('clean-job-status').process(1, cleanJobStatusConsumer)
  queue('clean-job-status').add({}, {jobId: 'cleanJobStatusJobId', repeat: {every: ms('1d')}, removeOnComplete: true})
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
