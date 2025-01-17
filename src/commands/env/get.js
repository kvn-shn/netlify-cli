const Command = require('../../utils/command')
const { track } = require('../../utils/telemetry')

class EnvGetCommand extends Command {
  async run() {
    const { args, flags } = this.parse(EnvGetCommand)
    const { api, cachedConfig, site } = this.netlify
    const siteId = site.id

    await track('command', {
      command: 'env:get',
    })

    if (!siteId) {
      this.log('No site id found, please run inside a site folder or `netlify link`')
      return false
    }

    const siteData = await api.getSite({ siteId })

    const { name } = args
    const { value } = cachedConfig.env[name] || {}

    // Return json response for piping commands
    if (flags.json) {
      this.logJson(value ? { [name]: value } : {})
      return false
    }

    if (!value) {
      this.log(`Environment variable ${name} not set for site ${siteData.name}`)
      return false
    }

    this.log(value)
  }
}

EnvGetCommand.description = `Get resolved value of specified environment variable (includes netlify.toml)`
EnvGetCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'Environment variable name',
  },
]

module.exports = EnvGetCommand
