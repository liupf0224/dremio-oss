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
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Immutable from "immutable";
import { v4 as uuidv4 } from "uuid";

import JobDetails from "#oss/pages/JobPage/components/JobDetails/JobDetails";

import {
  cancelJobAndShowNotification,
  loadJobDetails,
  showJobProfile,
} from "actions/jobs/jobs";
import { downloadFile } from "sagas/downloadFile";
import socket from "@inject/utils/socket";
import { getEntity, getViewState } from "selectors/resources";
import { updateViewState } from "actions/resources";
import "./JobDetails.less";

const VIEW_ID = "JOB_DETAILS_VIEW_ID";

export class JobDetailsWrapper extends PureComponent {
  static propTypes = {
    jobDetails: PropTypes.instanceOf(Immutable.Map),
    jobId: PropTypes.string,
    location: PropTypes.object,
    askGnarly: PropTypes.func,

    // actions
    loadJobDetails: PropTypes.func,
    cancelJob: PropTypes.func,
    downloadFile: PropTypes.func,
    showJobProfile: PropTypes.func,
    updateViewState: PropTypes.func,

    //connected
    token: PropTypes.string,
    viewState: PropTypes.instanceOf(Immutable.Map),
  };

  defaultProps = {
    jobDetails: Immutable.Map(),
  };

  constructor(props) {
    super(props);
    this.receiveProps(props, {});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.receiveProps(nextProps, this.props);
  }

  componentWillUnmount() {
    this.stopListenToJobChange(this.props.jobId);
  }

  receiveProps(nextProps, oldProps) {
    const jobId = nextProps.jobId;
    const oldJobId = oldProps.jobId;

    if (jobId && jobId !== oldJobId) {
      this.stopListenToJobChange(oldJobId);
      this.load(jobId);
    }
  }

  load = (jobId = this.props.jobId) => {
    return this.props.loadJobDetails(jobId, VIEW_ID).then((response) => {
      if (!response || (response.error && !response.payload)) return; // no-payload error check for DX-9340

      if (response.meta.jobId !== jobId) return;

      if (!response.error) {
        socket.startListenToJobChange(jobId);
      } else if (response.payload.status === 404) {
        this.props.updateViewState(VIEW_ID, {
          isFailed: false,
          isWarning: true,
          error: {
            message: laDeprecated(
              "Could not find the specified job's details, they may have been cleaned up.",
            ),
            id: uuidv4(),
          },
        });
      }
      return null;
    });
  };

  stopListenToJobChange(jobId) {
    if (jobId) {
      socket.stopListenToJobChange(jobId);
    }
  }

  cancelJob = () => {
    this.props.cancelJob(this.props.jobId);
  };

  downloadJobProfile = (viewId) => {
    this.props.downloadFile({
      url: `/support/${this.props.jobId}/download`,
      method: "POST",
      viewId,
    });
  };

  render() {
    const { jobId, jobDetails, viewState, location, askGnarly } = this.props;

    return (
      <JobDetails
        jobDetails={jobDetails}
        jobId={jobId}
        viewState={viewState}
        location={location}
        askGnarly={askGnarly}
        cancelJob={this.cancelJob}
        downloadFile={this.props.downloadFile}
        showJobProfile={this.props.showJobProfile}
        downloadJobProfile={this.downloadJobProfile}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    viewState: getViewState(state, VIEW_ID),
    jobDetails: getEntity(state, ownProps.jobId, "jobDetails"),
    token: state.account.get("user").get("token"),
  };
}

export default connect(mapStateToProps, {
  cancelJob: cancelJobAndShowNotification,
  loadJobDetails,
  downloadFile,
  showJobProfile,
  updateViewState,
})(JobDetailsWrapper);
