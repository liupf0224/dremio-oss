/*
 * Copyright (C) 2017-2019 Dremio Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { rest } from "msw";
import {
  aggReflectionRecommendationsResponse,
  rawReflectionRecommendationsResponse,
} from "./datasetReflectionRecommendationsResponse";
import { postDatasetReflectionRecommendationsUrl } from "../postDatasetReflectionRecommendations";

const getAggReflectionRecommendationsHandler = rest.get(
  decodeURIComponent(
    postDatasetReflectionRecommendationsUrl({
      datasetId: "7b00d147-e40c-4075-baec-38e910cb9c58",
      type: "agg",
    }).replace(`//${window.location.host}`, ""),
  ),
  (req, res, ctx) => {
    return res(ctx.delay(200), ctx.json(aggReflectionRecommendationsResponse));
  },
);

const getRawReflectionRecommendationsHandler = rest.get(
  decodeURIComponent(
    postDatasetReflectionRecommendationsUrl({
      datasetId: "7b00d147-e40c-4075-baec-38e910cb9c58",
      type: "raw",
    }).replace(`//${window.location.host}`, ""),
  ),
  (req, res, ctx) => {
    return res(ctx.delay(200), ctx.json(rawReflectionRecommendationsResponse));
  },
);

export const getReflectionRecommendationsHandler = [
  getAggReflectionRecommendationsHandler,
  getRawReflectionRecommendationsHandler,
];
