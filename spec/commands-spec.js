/* @flow */

import Path from 'path'
import { it } from 'jasmine-fix'
import Commands from '../lib/commands'
import { getState } from './common'

let commands

describe('Linter Commands', function() {
  beforeEach(function() {
    if (commands) {
      commands.dispose()
    }
    commands = new Commands(getState())
  })
  it('properly notifies its listeners of command execution', async function() {
    let lintCalled = 0
    let toggleCalled = 0
    let showProvidersCalled = 0

    commands.onShouldLint(() => ++lintCalled)
    commands.onShouldToggleActiveEditor(() => ++toggleCalled)
    commands.onShouldShowLinterProviders(() => ++showProvidersCalled)

    await atom.workspace.open(Path.join(__dirname, 'fixtures', 'file.txt'))
    const textEditor = atom.views.getView(atom.workspace.getActiveTextEditor())
    expect(lintCalled).toBe(0)
    expect(toggleCalled).toBe(0)
    expect(showProvidersCalled).toBe(0)
    atom.commands.dispatch(textEditor, 'linter:lint')
    expect(lintCalled).toBe(1)
    expect(toggleCalled).toBe(0)
    expect(showProvidersCalled).toBe(0)
    atom.commands.dispatch(textEditor, 'linter:toggle-active-editor')
    expect(lintCalled).toBe(1)
    expect(toggleCalled).toBe(1)
    expect(showProvidersCalled).toBe(0)
    atom.commands.dispatch(textEditor, 'linter:show-linter-providers')
    expect(lintCalled).toBe(1)
    expect(toggleCalled).toBe(1)
    expect(showProvidersCalled).toBe(1)
  })
})
