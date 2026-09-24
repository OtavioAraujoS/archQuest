import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TemplateTabs } from '@/components/templates/TemplateTabs'
import { DIAGRAM_TEMPLATES } from '@/templates'

function renderTemplateTabs(selectedIndex = 0) {
  const onTemplateSelected = vi.fn()
  render(
    <TemplateTabs
      templates={DIAGRAM_TEMPLATES}
      selectedTemplate={DIAGRAM_TEMPLATES[selectedIndex]}
      onTemplateSelected={onTemplateSelected}
    />,
  )
  return {
    onTemplateSelected,
    selectedTab: screen.getByRole('tab', { selected: true }),
  }
}

describe('TemplateTabs', () => {
  it('marks only the selected template tab as selected and focusable', () => {
    renderTemplateTabs(1)

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(DIAGRAM_TEMPLATES.length)
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveAttribute('tabindex', '0')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
    expect(tabs[0]).toHaveAttribute('tabindex', '-1')
  })

  it('selects the next template with the arrow keys', () => {
    const { onTemplateSelected, selectedTab } = renderTemplateTabs(0)

    fireEvent.keyDown(selectedTab, { key: 'ArrowDown' })

    expect(onTemplateSelected).toHaveBeenCalledWith(DIAGRAM_TEMPLATES[1])
  })

  it('wraps to the last template when moving back from the first', () => {
    const { onTemplateSelected, selectedTab } = renderTemplateTabs(0)

    fireEvent.keyDown(selectedTab, { key: 'ArrowLeft' })

    expect(onTemplateSelected).toHaveBeenCalledWith(DIAGRAM_TEMPLATES.at(-1))
  })

  it('ignores keys that do not move between tabs', () => {
    const { onTemplateSelected, selectedTab } = renderTemplateTabs(0)

    fireEvent.keyDown(selectedTab, { key: 'Enter' })

    expect(onTemplateSelected).not.toHaveBeenCalled()
  })
})
