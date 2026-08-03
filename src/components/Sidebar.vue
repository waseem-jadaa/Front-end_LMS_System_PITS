<template>
  <nav class="d-md-block sidebar text-white p-3 min-vh-100 shadow-sm" style="background-color: #2b1b17; border-top-left-radius: 0px; border-bottom-left-radius: 0px;">
    <h5 class="text-center py-3 border-bottom border-secondary border-opacity-50 font-serif text-white tracking-wide" style="font-family: Georgia, serif; letter-spacing: 1px;">
      Archive
    </h5>
    
    <ul class="nav flex-column mt-4 gap-3">
      <li class="nav-item">
        <router-link to="/" class="nav-link text-white py-3 px-4 rounded-pill d-flex align-items-center transition-all">
          <i class="bi bi-house-door me-3 fs-5"></i> <span class="fw-medium">Home</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/books" class="nav-link text-white py-3 px-4 rounded-pill d-flex align-items-center transition-all">
          <i class="bi bi-book me-3 fs-5"></i> <span class="fw-medium">Books</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/members" class="nav-link text-white py-3 px-4 rounded-pill d-flex align-items-center transition-all">
          <i class="bi bi-people me-3 fs-5"></i> <span class="fw-medium">Members</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/borrowings" class="nav-link text-white py-3 px-4 rounded-pill d-flex align-items-center transition-all">
          <i class="bi bi-journal-text me-3 fs-5"></i> <span class="fw-medium">Borrowings</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>

.nav-link {
  background-color: transparent;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.nav-link:hover {
  background-color: #4a3525;
  color: #f4ecd8 !important;
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateX(4px);
}

.router-link-active {
  background-color: #5a4033 !important;
  color: #d4af37 !important;
  border: 1px solid #d4af37;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>