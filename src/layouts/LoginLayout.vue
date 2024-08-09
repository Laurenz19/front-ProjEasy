<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-toolbar-title shrink class="row items-center no-wrap">
          <span class="q-ml-sm">ProjEasy</span>
        </q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>
    <q-page-container class="GPL__page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
