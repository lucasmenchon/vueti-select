var VueMultiSelect = Vue.component('VueMultiSelect', {
  template: `
  <div id="VueMultiSelect" class="dropdown">
    <button class="btn btn-default dropdown-toggle form-control" type="button" @click="toggleDropdown">
      {{ selectedOptions.length === 0 ? 'Nenhuma opção selecionada' : selectedOptions.join(', ') }}
      <span class="caret"></span>
    </button>
    <ul v-show="showDropdown" class="dropdown-menu">
      <li class="search-bar">
        <div class="input-group">
          <input type="text" v-model="searchTerm" placeholder="Pesquisar" class="form-control" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary clear-button" type="button" @click="clearSearch">
              X
            </button>
          </div>
        </div>
      </li>
      <li v-for="option in filteredOptions">
        <label>
          <input type="checkbox" v-model="selectedOptions" :value="option" />
          {{ option }}
        </label>
      </li>
    </ul>
  </div>
  `,
  data() {
    return {
      options: ['teste1', 'teste2', 'teste3'],
      selectedOptions: [],
      searchTerm: '',
      showDropdown: false
    }
  },
  computed: {
    filteredOptions() {
      return this.options.filter(option =>
        option.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    clearSearch() {
      this.searchTerm = '';
    }
  }
});
