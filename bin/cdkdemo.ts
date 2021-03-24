#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkdemoStack } from '../lib/cdkdemo-stack';

const app = new cdk.App();
new CdkdemoStack(app, 'CdkdemoStack');
