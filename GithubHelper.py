from github import Github
from github.InputGitTreeElement import InputGitTreeElement

class GithubHelper:
	def __init__:
		g = Github('crazyplum24@gmail.com', '1235813gg')
		repos = g.get_user().get_repos()
		self.repo = filter(lambda x: x.name == 'design_crowd', repos)[0]
		
	# abs_path of local directory(absolute path)
	# remote_filename on github remote repository
	def create_commit(abs_path, remote_filename, message):
		with open(abs_path, 'r') as f:
			contents = f.read()
		contents = contents.encode('utf-8')
		blob = self.repo.create_git_blob(contents, 'utf-8')
		master = self.repo.get_git_ref('heads/master')
		base_commit = self.repo.get_git_commit(master.object.sha)
		t = InputGitTreeElement(remote_filename, '100604', 'blob', sha = blob.sha)
		tree = self.repo.create_git_tree([t], base_tree = base_commit.tree)
		commit = repo.create_git_commit(message, tree, [base_commit])
		master.edit(commit.sha, force=True)

