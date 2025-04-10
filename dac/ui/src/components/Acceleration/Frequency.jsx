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
import { PureComponent } from "react";
import PropTypes from "prop-types";

import timeUtils from "utils/timeUtils";
import { TextField, Select } from "components/Fields";
import {
  selectDay,
  selectWeek,
  input,
} from "#oss/uiTheme/less/Acceleration/Frequency.less";
import Tabs from "../Tabs";

class Frequency extends PureComponent {
  static getFields() {
    return [
      "format",
      "month",
      "dayOfWeek",
      "hour",
      "minutes",
      "week",
      "period",
    ];
  }

  static propTypes = {
    curOption: PropTypes.string,
    fields: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.mins = timeUtils.getTimeRange(5, 55, true);
    this.hours = timeUtils.getTimeRange(1, 12);
    this.days = timeUtils.getDayOfWeek();
    this.weeks = [
      { label: "first", option: 1 },
      { label: "second", option: 2 },
      { label: "third", option: 3 },
      { label: "fourth", option: 4 },
    ];
    this.items = {
      format: [{ label: "am" }, { label: "pm" }],
      month: [{ label: "the second" }, { label: "exact day" }],
    };
  }

  renderPeriod() {
    const { period } = this.props.fields;
    return (
      <span>
        <span>{laDeprecated("Every")}</span>
        <TextField
          default={period.value || period.initialValue}
          type="number"
          {...period}
          className={input}
        />
      </span>
    );
  }

  renderDaily() {
    const { hour, minutes, format } = this.props.fields;
    return (
      <span>
        <Select
          value={hour.value || hour.initialValue}
          items={this.hours}
          {...hour}
          className={selectDay}
        />{" "}
        :
        <Select
          value={minutes.value || minutes.initialValue}
          items={this.mins}
          {...minutes}
          className={selectDay}
        />
        <Select
          value={format.value || format.initialValue}
          items={this.items.format}
          {...format}
          className={selectDay}
        />
      </span>
    );
  }

  renderDayOfWeekSelect() {
    const { dayOfWeek } = this.props.fields;
    return (
      <Select
        className={selectWeek}
        value={dayOfWeek.value || dayOfWeek.initialValue}
        items={this.days}
        {...dayOfWeek}
      />
    );
  }

  renderWeekSelect() {
    const { week } = this.props.fields;
    return (
      <Select
        className={selectWeek}
        value={week.value || week.initialValue}
        items={this.weeks}
        {...week}
      />
    );
  }

  render() {
    const { curOption } = this.props;
    return (
      <div>
        <Tabs activeTab={curOption}>
          <div tabId="NONE"></div>
          <div tabId="HOURLY">{this.renderPeriod()} hour(s)</div>
          <div tabId="DAILY">
            {this.renderPeriod()} day(s) at
            {this.renderDaily()}
          </div>
          <div tabId="WEEKLY">
            {this.renderPeriod()} week(s) on
            {this.renderDayOfWeekSelect()} at
            {this.renderDaily()}
          </div>
          <div tabId="MONTHLY">
            {this.renderPeriod()} month(s) on the
            {this.renderWeekSelect()}
            {this.renderDayOfWeekSelect()} at
            {this.renderDaily()}
          </div>
        </Tabs>
      </div>
    );
  }
}
export default Frequency;
