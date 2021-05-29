#!/usr/bin/env node
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './src/app.module';
// import yargs from 'yargs';
// const { hideBin } = require('yargs/helpers')

// const argv = yargs(hideBin(process.argv)).argv;

// async function bootstrap() {
//   console.log('argv = ', argv);
// }
// bootstrap();

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
  .command('serve [port]', 'start the server', (yargs) => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000
      })
  }, (argv) => {
    if (argv.verbose) console.info(`start server on :${argv.port}`)
    // serve(argv.port)
    console.log('serve port ', argv.port);
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .argv