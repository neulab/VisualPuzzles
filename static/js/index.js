document.addEventListener('DOMContentLoaded', () => {
  loadCognitiveTable();
  setupTableSorting();
});

function loadCognitiveTable() {
  fetch('cognitive_data.json')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#cog-table tbody');
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.model}</td>
          <td>${row.size}</td>
          <td>${row.algorithmic}</td>
          <td>${row.analogical}</td>
          <td>${row.deductive}</td>
          <td>${row.inductive}</td>
          <td>${row.spatial}</td>
          <td><b>${row.overall}</b></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error('Failed to load table data:', err);
      document.querySelector('#cog-table tbody').innerHTML =
        `<tr><td colspan="8">Error loading data. Please check console.</td></tr>`;
    });
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
