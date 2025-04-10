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
package com.dremio.sabot.rpc.user;

import com.dremio.options.OptionManager;

/** Impersonation manager interface */
public interface InboundImpersonationManager {
  /**
   * Check if the current session user, as a proxy user, is authorized to impersonate the given
   * target user based on the system's impersonation policies.
   *
   * @param targetName target user name
   * @param session user session
   */
  void replaceUserOnSession(String targetName, UserSession session);

  /**
   * Checks whether the proxy user is allowed to impersonate the target user. Throws a UserException
   * if the impersonation policy is violated.
   *
   * @param proxyName username of the proxy user. User can be local or imported from external
   *     provider.
   * @param targetName username of the subject user. User can be local or imported from external
   *     provider.
   * @param optionManager service that provides the impersonation policy string.
   */
  void canImpersonate(String proxyName, String targetName, OptionManager optionManager);
}
