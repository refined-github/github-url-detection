/// <reference types="vite/client" />
import source from '../index.ts?raw';
import {collect} from '../collector.ts';

export const {getAllUrls, getTests} = collect(source);
