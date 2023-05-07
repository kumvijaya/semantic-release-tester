const rules = function (commit) {return a * b};
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
          parserOpts: {
            transform: (commit, context) => {
              console.log('commit.message in analyzer writerOpts:' + commit.message)
            }
          },
          writerOpts: {
            transform: (commit, context) => {
              console.log('commit.message in analyzer writerOpts:' + commit.message)
            }
          },
          releaseRules: [
            {message: "*[[]major[]]*", release: "major"},
            {message: "*[[]bug-fix[]]*", release: "patch"},
            {message: "!(*[[]major[]]*|*[[]bug-fix[]]*)", release: "minor"},
            {
              subject: "!(*[[]major[]]*|*[[]bug-fix[]]*)",
              release: "minor"
            }
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

            if (commit.message.startsWith("Merge branch")) {
                return
            } else if (commit.message.includes("[major]")) {
                commit.type = `✨ Major`
            } else if (commit.message.includes("[bug-fix]")) {
                commit.type = `🐛 Bug-Fix`
            } else if (!(commit.message.includes("[major]") || commit.message.includes("[bug-fix]"))) {
                commit.type = `📝 Minor Changes`
            } else if (!(commit.subject.includes("[major]") || commit.subject.includes("[bug-fix]"))) {
                commit.type = `📝 Minor Changes`
            } else {
                return
            }
  
            if (commit.scope === `*`) {
                commit.scope = ``
            }
  
            if (typeof commit.hash === `string`) {
                commit.shortHash = commit.hash.substring(0, 7)
            }
            
            const issues = []
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