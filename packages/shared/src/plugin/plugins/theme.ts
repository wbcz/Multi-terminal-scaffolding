import { IPlugin, PluginContext } from '../core'

interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
}

export class ThemePlugin implements IPlugin {
  name = 'theme'
  version = '1.0.0'
  private currentTheme: Theme | null = null

  async install(context: PluginContext) {
    // 注册主题相关钩子
    context.registerHook('beforeThemeChange', this.beforeThemeChange.bind(this))
    context.registerHook('afterThemeChange', this.afterThemeChange.bind(this))
    context.registerHook('getTheme', this.getTheme.bind(this))

    // 监听主题相关事件
    context.events.on('themeChanged', this.onThemeChanged.bind(this))
    context.events.on('systemThemeChanged', this.onSystemThemeChanged.bind(this))
  }

  private async beforeThemeChange(newTheme: Theme) {
    console.log('Preparing to change theme to:', newTheme.name)
    return newTheme
  }

  private async afterThemeChange(theme: Theme) {
    this.currentTheme = theme
    document.documentElement.style.setProperty('--primary-color', theme.colors.primary)
    document.documentElement.style.setProperty('--secondary-color', theme.colors.secondary)
    document.documentElement.style.setProperty('--background-color', theme.colors.background)
    document.documentElement.style.setProperty('--text-color', theme.colors.text)
  }

  private getTheme() {
    return this.currentTheme
  }

  private onThemeChanged(theme: Theme) {
    console.log('Theme changed to:', theme.name)
  }

  private onSystemThemeChanged(isDark: boolean) {
    const theme = isDark ? this.darkTheme : this.lightTheme
    this.currentTheme = theme
    console.log('System theme changed to:', isDark ? 'dark' : 'light')
  }

  private get lightTheme(): Theme {
    return {
      name: 'light',
      colors: {
        primary: '#1890ff',
        secondary: '#52c41a',
        background: '#ffffff',
        text: '#000000'
      }
    }
  }

  private get darkTheme(): Theme {
    return {
      name: 'dark',
      colors: {
        primary: '#177ddc',
        secondary: '#49aa19',
        background: '#141414',
        text: '#ffffff'
      }
    }
  }
} 