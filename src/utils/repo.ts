import { window, extensions, Uri } from "vscode";
import { GitExtension, Repository } from "../typings/git";

export const getRepo = (repoUri: string): Repository | false => {
  const gitExtension = getGitExtension();
  if (!gitExtension?.enabled) {
    window.showErrorMessage(
      "Git extensions are not currently enabled, please try again after enabled!"
    );
    return false;
  }
  let repos: Repository[] = gitExtension.getAPI(1).repositories;
  const repo = repos.find(
    (e) => e.rootUri.toString() === repoUri
    // (e) => e._repository.repository.repositoryRoot === repoUri
  );
  if (!repo && window.activeTextEditor) {
    return getRepoContainingFile(window.activeTextEditor.document.uri, repos);
  }
  return repo || repos[0];
};

function getGitExtension() {
  const vscodeGit = extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = vscodeGit && vscodeGit.exports;
  return gitExtension;
}

/**
 * Get the repository that contains the specified file.
 * @param fileUri The uri of the file.
 * @returns The repository containing the file, or false if no known repository contains the file.
 */
export function getRepoContainingFile(fileUri: Uri, repos: Repository[]) {
  let repoUris = repos.map((rep) => rep.rootUri),
    repo = null;
  for (let i = 0; i < repoUris.length; i++) {
    if (
      fileUri
        .toString()
        .startsWith(pathWithTrailingSlash(repoUris[i].toString())) &&
      (repo === null ||
        repo.rootUri.toString().length < repoUris[i].toString().length)
    )
      repo = repos[i];
  }
  return repo || false;
}

/**
 * Get the path with a trailing slash.
 * @param path The path.
 * @returns The path with a trailing slash.
 */
export function pathWithTrailingSlash(path: string) {
  return path.endsWith("/") ? path : path + "/";
}
