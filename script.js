const navDialog = document.getElementById('nav-dialog ');
function handleMenu() {
   navDialog.classList.toggle('hidden');
}

function openUpdatePage(cell) {
  // Save cell position and current data to localStorage
  localStorage.setItem('routineCellIndex', cell.getAttribute('data-cell-index'));
  localStorage.setItem('routineCellContent', cell.innerHTML);
  window.location.href = 'update_slot.html';
}

function handleRoutineDelete(btn) {
  if (confirm('Are you sure you want to delete this entry?')) {
    btn.parentElement.innerHTML = '-<br>\n<button class="mt-1 text-blue-600 text-xs hover:underline">Update</button>\n<button class="mt-1 text-red-600 text-xs hover:underline ml-2">Delete</button>';
    addRoutineCellListeners(btn.parentElement);
  }
}

function addRoutineCellListeners(cell) {
  cell.querySelectorAll('button').forEach(function(btn) {
    if (btn.textContent.trim() === 'Delete') {
      btn.onclick = function(e) { handleRoutineDelete(e.target); };
    } else if (btn.textContent.trim() === 'Update') {
      btn.onclick = function(e) { openUpdatePage(cell); };
    }
  });
}

window.addEventListener('DOMContentLoaded', function() {
  // Add listeners to all routine table cells on load
  document.querySelectorAll('td[data-cell-index]').forEach(function(cell) {
    cell.querySelectorAll('button').forEach(function(btn) {
      if (btn.textContent.trim() === 'Delete') {
        btn.onclick = function(e) { handleRoutineDelete(e.target); };
      } else if (btn.textContent.trim() === 'Update') {
        btn.onclick = function(e) { openUpdatePage(cell); };
      }
    });
  });
  
  // Search functionality
  const searchToggle = document.getElementById('search-toggle');
  const searchBox = document.getElementById('search-box');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  // Toggle search box visibility
  if (searchToggle && searchBox) {
    searchToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      searchBox.classList.toggle('hidden');
      if (!searchBox.classList.contains('hidden')) {
        searchInput.focus();
      }
    });
    
    // Close search box when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchBox.contains(e.target) && e.target !== searchToggle) {
        searchBox.classList.add('hidden');
      }
    });
  }
  
  // Handle search form submission
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        // You can implement different search behaviors:
        // 1. Redirect to a search results page
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
        
        // 2. Or perform an in-page search (example):
        // performInPageSearch(query);
        
        // For now, we'll just alert the search query
        alert(`Searching for: ${query}`);
        searchBox.classList.add('hidden');
      }
    });
  }

  // If on update_slot.html, populate form if editing
  if (window.location.pathname.includes('update_slot.html')) {
    const cellIndex = localStorage.getItem('routineCellIndex');
    const content = localStorage.getItem('routineCellContent');
    // Only prefill if content is not empty or dash
    if (content && content.indexOf('Room:') !== -1) {
      const roomMatch = content.match(/Room: ([^<]*)/);
      const subjectMatch = content.match(/Subject: ([^<]*)/);
      const teacherMatch = content.match(/Teacher: ([^<]*)/);
      if (roomMatch) document.getElementById('room').value = roomMatch[1];
      if (subjectMatch) document.getElementById('subject').value = subjectMatch[1];
      if (teacherMatch) document.getElementById('teacher').value = teacherMatch[1];
    } else {
      // Clear fields for empty/dash slots
      document.getElementById('room').value = '';
      document.getElementById('subject').value = '';
      document.getElementById('teacher').value = '';
    }
    document.getElementById('updateForm').onsubmit = function(e) {
      e.preventDefault();
      const room = document.getElementById('room').value;
      const subject = document.getElementById('subject').value;
      const teacher = document.getElementById('teacher').value;
      localStorage.setItem('routineCellUpdate', JSON.stringify({cellIndex, room, subject, teacher}));
      window.location.href = 'routine.html';
    };
    document.getElementById('deleteBtn').onclick = function() {
      localStorage.setItem('routineCellDelete', cellIndex);
      window.location.href = 'routine.html';
    };
  }

  // If on routine.html, check for update or delete
  if (window.location.pathname.includes('routine.html')) {
    // Update
    const update = localStorage.getItem('routineCellUpdate');
    if (update) {
      const {cellIndex, room, subject, teacher} = JSON.parse(update);
      const cell = document.querySelector('td[data-cell-index="'+cellIndex+'"]');
      if (cell) {
        cell.innerHTML = `Room: ${room}<br>Subject: ${subject}<br>Teacher: ${teacher}<br>\n<button class="mt-1 text-blue-600 text-xs hover:underline">Update</button>\n<button class="mt-1 text-red-600 text-xs hover:underline ml-2">Delete</button>`;
        // Re-attach listeners
        cell.querySelectorAll('button').forEach(function(btn) {
          if (btn.textContent.trim() === 'Delete') {
            btn.onclick = function(e) { handleRoutineDelete(e.target); };
          } else if (btn.textContent.trim() === 'Update') {
            btn.onclick = function(e) { openUpdatePage(cell); };
          }
        });
      }
      localStorage.removeItem('routineCellUpdate');
    }
    // Delete
    const del = localStorage.getItem('routineCellDelete');
    if (del) {
      const cell = document.querySelector('td[data-cell-index="'+del+'"]');
      if (cell) {
        cell.innerHTML = '-<br>\n<button class="mt-1 text-blue-600 text-xs hover:underline">Update</button>\n<button class="mt-1 text-red-600 text-xs hover:underline ml-2">Delete</button>';
        // Re-attach listeners
        cell.querySelectorAll('button').forEach(function(btn) {
          if (btn.textContent.trim() === 'Delete') {
            btn.onclick = function(e) { handleRoutineDelete(e.target); };
          } else if (btn.textContent.trim() === 'Update') {
            btn.onclick = function(e) { openUpdatePage(cell); };
          }
        });
      }
      localStorage.removeItem('routineCellDelete');
    }
  }
});
