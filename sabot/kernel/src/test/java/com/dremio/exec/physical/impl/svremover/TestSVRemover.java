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
package com.dremio.exec.physical.impl.svremover;

import static org.junit.Assert.assertEquals;

import com.dremio.BaseTestQuery;
import org.junit.Test;

public class TestSVRemover extends BaseTestQuery {
  @Test
  public void testSelectionVectorRemoval() throws Exception {
    int numOutputRecords = testPhysical(getFile("remover/test1.json"));
    assertEquals(50, numOutputRecords);
  }

  @Test
  public void testSVRWithNoFilter() throws Exception {
    int numOutputRecords = testPhysical(getFile("remover/sv_with_no_filter.json"));
    assertEquals(100, numOutputRecords);
  }
}
