<template>
  <header class="navbar navbar-expand-lg px-4 border-bottom shadow-sm" style="background-color: #fdfbf7; border-color: #e6dbcc !important;">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold fs-3 text-dark font-serif" style="font-family: Georgia, serif; color: #4a3525 !important;">
        <span class="text-warning">📜</span> Dar Al-Hikma
      </a>
        <div class="d-flex w-50 mx-auto">
         <div class="input-group">
          <span class="input-group-text bg-white border-end-0" style="border-color: #d4c5b9;">
            <img :src="searchIcon" alt="search" width="18" height="18" />
          </span>
          <input 
            type="text" 
            class="form-control border-start-0 shadow-none" 
            placeholder="Find a book, author, or ancient manuscript..."
            style="border-color: #d4c5b9; background-color: #fff;"
          />
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <button class="btn p-2 rounded-circle border-0 d-flex align-items-center justify-content-center" style="background-color: #f4ecd8; width: 38px; height: 38px;" title="تغيير اللغة">
          <img :src="langIcon" alt="language" width="20" height="20" />
        </button>

        <button class="btn p-2 rounded-circle border-0 d-flex align-items-center justify-content-center position-relative" style="background-color: #f4ecd8; width: 38px; height: 38px;" title="الإشعارات">
          <img :src="notifIcon" alt="notifications" width="20" height="20" />
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import searchIcon from '../assets/icons/search.svg'
import langIcon from '../assets/icons/language.svg'
import notifIcon from '../assets/icons/notifications.svg'
</script>