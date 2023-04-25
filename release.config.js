module.exports = {
    branches: [
        'master',
        'main',
        {
          name: 'beta',
          prerelease: true
        },
        {
          name: 'alpha',
          prerelease: true
        }
      ],
    plugins: [
        ['@semantic-release/commit-analyzer', {
          preset: 'conventionalcommits',
          releaseRules: [
            {message: "*[[]major[]]*", release: "major"},
            {message: "*[[]bug-fix[]]*", release: "patch"},
            {message: "!(*[[]major[]]*|*[[]bug-fix[]]*)", release: "minor"},
            // {breaking: true, release: 'major'},
            // {type: 'build', release: 'patch'},
            // {type: 'chore', release: 'patch'},
            // {type: 'ci', release: 'patch'},
            // {type: 'docs', release: 'patch'},
            // {type: 'feat', release: 'minor'},
            // {type: 'fix', release: 'patch'},
            // {type: 'perf', release: 'patch'},
            // {type: 'refactor', release: 'patch'},
            // {type: 'revert', release: 'patch'},
            // {type: 'style', release: 'patch'},
            // {type: 'test', release: 'patch'}
          ]
        }],
        '@semantic-release/release-notes-generator',
        ['@semantic-release/changelog', {
          changelogFile: 'CHANGELOG.md',
          changelogTitle: '# Changelog',
        }],
        ['@semantic-release/git', {
            assets: ['*.md']
          }],
        '@semantic-release/github',
    ],
    generateNotes: {
      preset: 'conventionalcommits',
      writerOpts: {
        transform: (commit, context) => {
            const issues = []
  
            // commit.notes.forEach(note => {
            //     note.title = `BREAKING CHANGES`
            // })
            
            // NOTE: Any changes here must be reflected in `CONTRIBUTING.md`.
            if (commit.message.startsWith("Merge branch")) {
                return
            } else if (commit.message.includes("[major]")) {
                commit.type = `✨ Major`
            } else if (commit.message.includes("[bug-fix]")) {
                commit.type = `🐛 Bug-Fix`
            } else if (!(commit.message.includes("[major]") || commit.message.includes("[bug-fix]"))) {
                commit.type = `📝 Minor Changes`
            // } else if (commit.type === `feat`) {
            //     commit.type = `Features`
            // } else if (commit.type === `fix`) {
            //     commit.type = `Bug Fixes`
            // } else if (commit.type === `perf`) {
            //     commit.type = `Performance Improvements`
            // } else if (commit.type === `revert`) {
            //     commit.type = `Reverts`
            // } else if (commit.type === `docs`) {
            //     commit.type = `Documentation`
            // } else if (commit.type === `style`) {
            //     commit.type = `Styles`
            // } else if (commit.type === `refactor`) {
            //     commit.type = `Code Refactoring`
            // } else if (commit.type === `test`) {
            //     commit.type = `Tests`
            // } else if (commit.type === `build`) {
            //     commit.type = `Build System`
            // // } else if (commit.type === `chore`) {
            // //     commit.type = `Maintenance`
            // } else if (commit.type === `ci`) {
            //     commit.type = `Continuous Integration`
            } else {
                return
            }
  
            if (commit.scope === `*`) {
                commit.scope = ``
            }
  
            if (typeof commit.hash === `string`) {
                commit.shortHash = commit.hash.substring(0, 7)
            }
  
            if (typeof commit.subject === `string`) {
                let url = context.repository
                    ? `${context.host}/${context.owner}/${context.repository}`
                    : context.repoUrl
                if (url) {
                    url = `${url}/issues/`
                    // Issue URLs.
                    commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
                        issues.push(issue)
                        return `[#${issue}](${url}${issue})`
                    })
                }
                if (context.host) {
                    // User URLs.
                    commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
                    if (username.includes('/')) {
                        return `@${username}`
                    }
  
                    return `[@${username}](${context.host}/${username})`
                    })
                }
            }

            // remove references that already appear in the subject
            commit.references = commit.references.filter(reference => {
                if (issues.indexOf(reference.issue) === -1) {
                    return true
                }
                return false
            })

            return commit
        },
      },
    },
  };