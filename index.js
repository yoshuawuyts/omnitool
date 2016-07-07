const panels = window.chrome.devtools.panels
panels.elements.createSidebarPane('My Sidebar', (sidebar) => {
  sidebar.setObject({ some_data: 'Some data to show' })
})
