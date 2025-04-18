import { Octokit } from 'octokit';


interface getRawFileContentProps {
  path: string;
  token?: string;
  owner?: string;
  repo?: string;
}
export const getRawFileContent = async ({ path, owner, repo, token }: getRawFileContentProps) => {
  const main_git_token = "TODO:faketoken"
  const main_git_owner = "TODO:main_git_owner"
  const main_git_repo = "TODO:main_git_repo"
  const octokit = new Octokit({
    // auth: token || app.config?.gh_main_token || '',
    auth: main_git_token,
  });
  const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: owner || main_git_owner || '',
    repo: repo || main_git_repo || '',
    path: path,
  });
  //@ts-ignore
  return Buffer.from(response.data.content, 'base64').toString();
};
