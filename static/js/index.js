let tableData = [];
let currentView = 'category';
let filters = {
  human: true,
  proprietary: true,
  open: true,
  searchText: ''
};

document.addEventListener('DOMContentLoaded', () => {
  loadCognitiveTable();
  setupViewSelector();
  setupFilters();
  setupTableSorting();
});

function setupViewSelector() {
  const radios = document.querySelectorAll('input[name="table-view"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentView = e.target.value;
      renderTable();
    });
  });
}

function setupFilters() {
  // Model type checkboxes
  const filterHuman = document.getElementById('filter-human');
  const filterProprietary = document.getElementById('filter-proprietary');
  const filterOpen = document.getElementById('filter-open');
  
  if (filterHuman) {
    filterHuman.addEventListener('change', (e) => {
      filters.human = e.target.checked;
      renderTable();
    });
  }
  
  if (filterProprietary) {
    filterProprietary.addEventListener('change', (e) => {
      filters.proprietary = e.target.checked;
      renderTable();
    });
  }
  
  if (filterOpen) {
    filterOpen.addEventListener('change', (e) => {
      filters.open = e.target.checked;
      renderTable();
    });
  }
  
  // Search box
  const searchBox = document.getElementById('model-search');
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      filters.searchText = e.target.value.toLowerCase();
      renderTable();
    });
  }
}

function shouldShowRow(row) {
  // Filter by model type
  if (row.model_type === 'human' && !filters.human) return false;
  if (row.model_type === 'proprietary' && !filters.proprietary) return false;
  if (row.model_type === 'open' && !filters.open) return false;
  
  // Filter by search text
  if (filters.searchText && !row.model.toLowerCase().includes(filters.searchText)) {
    return false;
  }
  
  return true;
}

function loadCognitiveTable() {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      tableData = data;
      renderTable();
    })
    .catch(err => {
      console.error('Failed to load table data:', err);
      document.querySelector('#cog-table tbody').innerHTML =
        `<tr><td colspan="8">Error loading data. Please check console.</td></tr>`;
    });
}

function renderTable() {
  if (!tableData.length) return;

  const table = document.querySelector('#cog-table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  // Clear existing content
  thead.innerHTML = '';
  tbody.innerHTML = '';
  
  // Remove or add 'both-view' class based on current view
  if (currentView === 'both') {
    table.classList.add('both-view');
  } else {
    table.classList.remove('both-view');
  }

  // Sort data by overall descending and apply filters
  const sortedData = [...tableData]
    .filter(shouldShowRow)
    .sort((a, b) => 
      parseFloat(b.overall.overall) - parseFloat(a.overall.overall)
    );

  if (currentView === 'category') {
    // View by category: Model, Size, Algorithmic, Analogical, Deductive, Inductive, Spatial, Overall
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Model</th>
      <th>Size</th>
      <th>Algorithmic</th>
      <th>Analogical</th>
      <th>Deductive</th>
      <th>Inductive</th>
      <th>Spatial</th>
      <th>Overall</th>
    `;
    thead.appendChild(headerRow);

    sortedData.forEach(row => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-model-type', row.model_type);
      setRowBackground(tr, row.model_type);
      tr.innerHTML = `
        <td>${row.model}</td>
        <td>${row.size}</td>
        <td>${row.overall.algorithmic.toFixed(1)}</td>
        <td>${row.overall.analogical.toFixed(1)}</td>
        <td>${row.overall.deductive.toFixed(1)}</td>
        <td>${row.overall.inductive.toFixed(1)}</td>
        <td>${row.overall.spatial.toFixed(1)}</td>
        <td><b>${row.overall.overall.toFixed(1)}</b></td>
      `;
      tbody.appendChild(tr);
    });

  } else if (currentView === 'difficulty') {
    // View by difficulty: Model, Size, Easy, Medium, Hard, Overall
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Model</th>
      <th>Size</th>
      <th>Easy</th>
      <th>Medium</th>
      <th>Hard</th>
      <th>Overall</th>
    `;
    thead.appendChild(headerRow);

    sortedData.forEach(row => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-model-type', row.model_type);
      setRowBackground(tr, row.model_type);
      tr.innerHTML = `
        <td>${row.model}</td>
        <td>${row.size}</td>
        <td>${row.easy.overall.toFixed(1)}</td>
        <td>${row.medium.overall.toFixed(1)}</td>
        <td>${row.hard.overall.toFixed(1)}</td>
        <td><b>${row.overall.overall.toFixed(1)}</b></td>
      `;
      tbody.appendChild(tr);
    });

  } else if (currentView === 'both') {
    // View by both: Model, Size, then columns for each category × difficulty combination
    // Create first header row with category names
    const firstRow = document.createElement('tr');
    firstRow.innerHTML = `
      <th rowspan="2">Model</th>
      <th rowspan="2">Size</th>
      <th colspan="3">Algorithmic</th>
      <th colspan="3">Analogical</th>
      <th colspan="3">Deductive</th>
      <th colspan="3">Inductive</th>
      <th colspan="3">Spatial</th>
      <th rowspan="2">Overall</th>
    `;
    thead.appendChild(firstRow);
    
    // Create second header row with difficulty labels
    const subHeaderRow = document.createElement('tr');
    const categories = ['Algorithmic', 'Analogical', 'Deductive', 'Inductive', 'Spatial'];
    categories.forEach(() => {
      ['Easy', 'Medium', 'Hard'].forEach(diff => {
        const th = document.createElement('th');
        th.textContent = diff;
        th.style.fontSize = '0.85em';
        subHeaderRow.appendChild(th);
      });
    });
    thead.appendChild(subHeaderRow);

    sortedData.forEach(row => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-model-type', row.model_type);
      setRowBackground(tr, row.model_type);
      tr.innerHTML = `
        <td>${row.model}</td>
        <td>${row.size}</td>
        <td>${row.easy.algorithmic.toFixed(1)}</td>
        <td>${row.medium.algorithmic.toFixed(1)}</td>
        <td>${row.hard.algorithmic.toFixed(1)}</td>
        <td>${row.easy.analogical.toFixed(1)}</td>
        <td>${row.medium.analogical.toFixed(1)}</td>
        <td>${row.hard.analogical.toFixed(1)}</td>
        <td>${row.easy.deductive.toFixed(1)}</td>
        <td>${row.medium.deductive.toFixed(1)}</td>
        <td>${row.hard.deductive.toFixed(1)}</td>
        <td>${row.easy.inductive.toFixed(1)}</td>
        <td>${row.medium.inductive.toFixed(1)}</td>
        <td>${row.hard.inductive.toFixed(1)}</td>
        <td>${row.easy.spatial.toFixed(1)}</td>
        <td>${row.medium.spatial.toFixed(1)}</td>
        <td>${row.hard.spatial.toFixed(1)}</td>
        <td><b>${row.overall.overall.toFixed(1)}</b></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Re-setup sorting after rendering
  setupTableSorting();
}

function setRowBackground(tr, modelType) {
  if (modelType === 'proprietary') {
    tr.style.backgroundColor = '#CAE9F5';
  } else if (modelType === 'human') {
    tr.style.backgroundColor = '#fbeeff';
  } else if (modelType === 'open') {
    tr.style.backgroundColor = '#F5F5DC';
  }
}



function setupTableSorting() {
  const headers = document.querySelectorAll('#cog-table thead th');
  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const table = header.closest('table');
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const ascending = !header.classList.contains('asc');

      rows.sort((a, b) => {
        let aVal = a.children[index].innerText.trim();
        let bVal = b.children[index].innerText.trim();

        // Special sorting for the Size column
        if (index === 1) {
          // Convert '7B' -> 7, '-' -> -1 (so '-' always goes last)
          const parseSize = str => {
            const match = str.match(/^(\d+(?:\.\d+)?)B$/);
            return match ? parseFloat(match[1]) : -1;
          };
          aVal = parseSize(aVal);
          bVal = parseSize(bVal);
          return ascending ? aVal - bVal : bVal - aVal;
        }

        // Default numeric or string sorting
        const isNumber = !isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal));
        if (isNumber) {
          return ascending ? aVal - bVal : bVal - aVal;
        } else {
          return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
      });

      // Re-render rows
      tbody.innerHTML = '';
      rows.forEach(row => tbody.appendChild(row));

      // Update visual styles
      headers.forEach(h => h.classList.remove('asc', 'desc', 'sorted-column'));
      header.classList.add(ascending ? 'asc' : 'desc');
      header.classList.add('sorted-column');
    });
  });
}

