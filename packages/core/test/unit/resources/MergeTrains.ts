import { RequestHelper } from '../../../src/infrastructure';
import { MergeTrains } from '../../../src';

jest.mock(
  '../../../src/infrastructure/RequestHelper',
  () => require('../../__mocks__/RequestHelper').default,
);

let service: MergeTrains;

beforeEach(() => {
  service = new MergeTrains({
    requesterFn: jest.fn(),
    token: 'abcdefg',
    requestTimeout: 3000,
  });
});

describe('Instantiating MergeTrains service', () => {
  it('should create a valid service object', () => {
    expect(service).toBeInstanceOf(MergeTrains);
    expect(service.url).toBeDefined();
    expect(service.rejectUnauthorized).toBeTruthy();
    expect(service.headers).toMatchObject({ 'private-token': 'abcdefg' });
    expect(service.requestTimeout).toBe(3000);
  });
});

describe('MergeTrains.all', () => {
  it('should request GET /projects/:id/merge_trains when project Id is passed', async () => {
    await service.all(1);

    expect(RequestHelper.get()).toHaveBeenCalledWith(service, 'projects/1/merge_trains', undefined);
  });

  it('should request GET /projects/:id/merge_trains/:target_branch when target_branch is passed', async () => {
    await service.all(2, 'main');

    expect(RequestHelper.get()).toHaveBeenCalledWith(
      service,
      'projects/2/merge_trains/main',
      undefined,
    );
  });
});

describe('MergeTrains.add', () => {
  it('should request POST projects/:id/merge_trains/merge_requests/:merge_request_iid', async () => {
    await service.add(2, 5);

    expect(RequestHelper.post()).toHaveBeenCalledWith(
      service,
      'projects/2/merge_trains/merge_requests/5',
      undefined,
    );
  });

  it('should request POST projects/:id/merge_trains/merge_requests/:merge_request_iid with options', async () => {
    await service.add(2, 5, { when_pipeline_succeeds: true, sha: 'abcddcba', squash: false });

    expect(RequestHelper.post()).toHaveBeenCalledWith(
      service,
      'projects/2/merge_trains/merge_requests/5',
      {
        when_pipeline_succeeds: true,
        sha: 'abcddcba',
        squash: false,
      },
    );
  });
});
