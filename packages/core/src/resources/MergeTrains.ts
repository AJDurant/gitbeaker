import { BaseResource } from '@gitbeaker/requester-utils';
import { PaginatedRequestOptions, RequestHelper, endpoint } from '../infrastructure';
import { UserSchema } from './Users';
import { MergeRequestSchema } from './MergeRequests';
import { PipelineExtendedSchema } from './Pipelines';

export interface MergeTrainOptions {
  scope?: 'active' | 'complete';
  sort?: 'asc' | 'desc';
}

export interface AddMergeTrainOptions {
  when_pipeline_succeeds?: boolean;
  sha?: string;
  squash?: boolean;
}

export interface MergeTrainSchema extends Record<string, unknown> {
  id: number;
  merge_request: Pick<
    MergeRequestSchema,
    | 'id'
    | 'iid'
    | 'project_id'
    | 'title'
    | 'description'
    | 'state'
    | 'created_at'
    | 'updated_at'
    | 'web_url'
  >;
  user: Omit<UserSchema, 'created_at'>;
  pipeline: Pick<
    PipelineExtendedSchema,
    | 'id'
    | 'project_id'
    | 'sha'
    | 'ref'
    | 'status'
    | 'source'
    | 'created_at'
    | 'updated_at'
    | 'web_url'
  >;
  created_at: string;
  updated_at: string;
  target_branch: string;
  status: string;
  merged_at: string;
  duration: number;
}

export class MergeTrains<C extends boolean = false> extends BaseResource<C> {
  all(
    projectId: string | number,
    target_branch?: string,
    options?: MergeTrainOptions & PaginatedRequestOptions,
  ) {
    let url: string;
    if (target_branch) {
      url = endpoint`projects/${projectId}/merge_trains/${target_branch}`;
    } else {
      url = endpoint`projects/${projectId}/merge_trains`;
    }

    return RequestHelper.get<MergeTrainSchema[]>()(this, url, options);
  }

  mergeRequest(
    projectId: string | number,
    merge_request_iid: number,
    options?: PaginatedRequestOptions,
  ) {
    return RequestHelper.get<MergeTrainSchema>()(
      this,
      endpoint`projects/${projectId}/merge_trains/merge_requests/${merge_request_iid}`,
      options,
    );
  }

  add(
    projectId: string | number,
    merge_request_iid: number,
    options?: AddMergeTrainOptions & PaginatedRequestOptions,
  ) {
    return RequestHelper.post<MergeTrainSchema>()(
      this,
      endpoint`projects/${projectId}/merge_trains/merge_requests/${merge_request_iid}`,
      options,
    );
  }
}
