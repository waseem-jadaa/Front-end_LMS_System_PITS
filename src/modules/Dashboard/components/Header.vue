<template>
  <header class="navbar navbar-expand-lg px-4 border-bottom shadow-sm site-header">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold fs-3 text-dark font-serif site-brand">
        <span class="text-warning">📜</span> Dar Al-Hikma
      </a>
      <div class="d-flex w-50 mx-auto">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0 search-icon-wrap">
            <img :src="searchIcon" alt="search" width="18" height="18" />
          </span>
          <input 
            type="text" 
            class="form-control border-start-0 shadow-none search-input" 
            placeholder="Find a book, author, or ancient manuscript..."
          />
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <button class="btn p-2 rounded-circle border-0 d-flex align-items-center justify-content-center icon-btn" title="تغيير اللغة">
          <img :src="langIcon" alt="language" width="20" height="20" />
        </button>

        <button class="btn p-2 rounded-circle border-0 d-flex align-items-center justify-content-center position-relative icon-btn" title="الإشعارات">
          <img :src="notifIcon" alt="notifications" width="20" height="20" />
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>
        
        <div class="dropdown ms-2 border-start ps-3 border-secondary border-opacity-25">
          <button class="btn border-0 p-0 d-flex align-items-center gap-2 user-dropdown-toggle shadow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="avatar-sm rounded-circle d-flex align-items-center justify-content-center fw-bold">
              {{ userInitial }}
            </div>
            <span class="fw-medium text-dark d-none d-md-block">{{ currentUser.name }}</span>
          </button>
          
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 p-3 user-dropdown-menu">
            <li class="text-center mb-3 mt-2">
              <div class="avatar-lg rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold fs-3 shadow-sm">
                {{ userInitial }}
              </div>
              <h6 class="mb-0 fw-bold">{{ currentUser.name }}</h6>
              <small class="text-muted">{{ currentUser.email }}</small>
            </li>
            
            <li><hr class="dropdown-divider border-secondary border-opacity-25 my-3"></li>
            
            <li>
              <button class="dropdown-item py-2 px-3 text-danger rounded transition-all fw-bold text-center" @click="handleLogout">
                Logout
              </button>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import searchIcon from '../../../assets/icons/search.svg'
import langIcon from '../../../assets/icons/language.svg'
import notifIcon from '../../../assets/icons/notifications.svg'

const router = useRouter()

const currentUser = ref({
  name: 'Waseem Jadaa',
  email: 'admin@daralhikma.com'
})

const userInitial = computed(() => {
  return currentUser.value.name ? currentUser.value.name.charAt(0).toUpperCase() : 'U'
})

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  router.push('/auth')
}
</script>

<style scoped>
.site-header {
  background-color: #fdfbf7;
  border-bottom-color: #e6dbcc !important;
}

.site-brand {
  font-family: Georgia, serif;
  color: #4a3525 !important;
}

.search-icon-wrap {
  border-color: #d4c5b9;
}

.search-input {
  border-color: #d4c5b9;
  background-color: #fff;
}

.icon-btn {
  background-color: #f4ecd8;
  width: 38px;
  height: 38px;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: #e6dbcc;
  transform: scale(1.05);
}

.avatar-sm {
  width: 36px;
  height: 36px;
  background-color: #2b1b17;
  color: #d4af37;
  border: 1.5px solid #d4af37;
  font-size: 1.1rem;
}

.avatar-lg {
  width: 72px;
  height: 72px;
  background-color: #2b1b17;
  color: #d4af37;
  border: 2px solid #d4af37;
}

.user-dropdown-toggle {
  transition: opacity 0.2s;
}

.user-dropdown-toggle:hover {
  opacity: 0.85;
}

.user-dropdown-toggle::after {
  display: none;
}

.user-dropdown-menu {
  width: 260px;
  background-color: #fcf9f2;
  border: 1px solid #e6dbcc !important;
  border-radius: 12px;
}

.dropdown-item {
  font-weight: 500;
  color: #4a3525;
}

.dropdown-item:hover {
  background-color: #f4ecd8;
  color: #2b1b17;
}

.dropdown-item.text-danger:hover {
  background-color: #fee2e2;
  color: #dc3545 !important;
}
</style>
