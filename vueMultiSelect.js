var VueMultiSelect = Vue.component('VueMultiSelect', {
  template:`
<div id="VueMultiSelect" class="vuetiSelectBox">
    <button :class="cssBtnBox.customBtn" type="button" @click="toggleDropdown()" @mouseenter="changeIconBtn(true)"
      @mouseleave="changeIconBtn(false)">
      {{ selectedOptions.length === 0 ? 'Nenhuma opção selecionada' : selectedOptions.join(', ') }}
      <i class="fas fa-arrow-alt-circle-right arrowIcon" :class="cssBtnBox.icon"></i>
    </button>
    <div v-show="showDropdownMenu" class="dropdownMenu">
      <div class="searchBox">
        <button class="searchIcon" type="button">
          <i class="fas fa-search"></i>
        </button>
        <input type="text" v-model="searchTerm" placeholder="Pesquisar" class="searchBar" />
        <button class="clearButton" type="button" @click="clearSearch">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div :class="cssDropdownBox">
        <ul class="ulMenu">
          <li>Selecionar tudo</li>
          <li v-for="group in filteredOptions" :key="group.name">
            <div class="">
              <label class="">
                <input type="checkbox" v-model="selectedOptions" :value="group.name"
                  class="form-check-input select-all-checkbox" />
                {{ group.name }}
              </label>
              <button class="group-toggle-button" type="button" @click="toggleGroup(group)">
                <i class="fas" :class="group.expanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
              </button>
            </div>
            <ul v-show="group.expanded" class="ulMenu">
              <li v-for="object in group.objects" :key="object">
                <label class="">
                  <input type="checkbox" v-model="selectedOptions" :value="object" class="" />
                  {{ object }}
                </label>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
  `,

  data() {
    return {
      groups: [
        { name: 'Roupas', expanded: false, objects: ['Calça', 'Camisa', 'Casaco'] },
        { name: 'Acessórios', expanded: false, objects: ['Óculos', 'Boné', 'Colar'] },
        { name: 'Alimentos', expanded: false, objects: ['Frutas', 'Legumes', 'Carnes'] },
        { name: 'Eletrônicos', expanded: false, objects: ['Smartphone', 'Notebook', 'Fones de Ouvido'] },
        { name: 'Livros', expanded: false, objects: ['Ficção', 'Não Ficção', 'Autoajuda'] },
        { name: 'Esportes', expanded: false, objects: ['Bola', 'Raquete', 'Tênis'] },
        { name: 'Casa', expanded: false, objects: ['Sofá', 'Mesa', 'Cadeira'] },
        { name: 'Beleza', expanded: false, objects: ['Maquiagem', 'Creme', 'Perfume'] },
        { name: 'Brinquedos', expanded: false, objects: ['Boneca', 'Carrinho', 'Bola'] },
        { name: 'Jogos', expanded: false, objects: ['Tabuleiro', 'Cartas', 'Videogame'] },
        { name: 'Ferramentas', expanded: false, objects: ['Martelo', 'Chave de Fenda', 'Serra'] },
        { name: 'Viagens', expanded: false, objects: ['Passagem Aérea', 'Hotel', 'Mala'] },
        { name: 'Viagens', expanded: false, objects: ['Passagem Aérea', 'Hotel', 'Mala'] },
        { name: 'Viagens', expanded: false, objects: ['Passagem Aérea', 'Hotel', 'Mala'] },
        { name: 'Viagens', expanded: false, objects: ['Passagem Aérea', 'Hotel', 'Mala'] },
        { name: 'Viagens', expanded: false, objects: ['Passagem Aérea', 'Hotel', 'Mala'] },
        { name: 'Viagens', expanded: false, objects: ['Passagem Aérea', 'Hotel', 'Mala'] },
      ],
      selectedOptions: [],
      searchTerm: '',
      showDropdownMenu: false,
      cssBtnBox: {
        customBtn: 'close-btnVueti',
        icon: 'close'
      },
      cssDropdownBox: '',
      isMouseOver: false,
    }
  },
  computed: {
    filteredOptions() {
      return this.groups.filter(group =>
        group.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        group.objects.some(object =>
          object.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdownMenu = !this.showDropdownMenu;
      if (this.showDropdownMenu) {
        this.cssBtnBox.customBtn = 'open-btnVueti';
        this.cssDropdownBox = 'dropdownBox';
        document.addEventListener('click', this.handleOutsideClick);
      } else {
        this.cssBtnBox.customBtn = 'close-btnVueti';
        this.cssDropdownBox = '';
        document.removeEventListener('click', this.handleOutsideClick);
      }
    },
    changeIconBtn(value) {
      if (this.showDropdownMenu) {
        this.cssBtnBox.icon = 'open';
      } else {
        this.cssBtnBox.icon = value ? 'open' : 'close';
      }
    },
    clearSearch() {
      this.searchTerm = '';
    },
    toggleGroup(group) {
      group.expanded = !group.expanded;
    },
    handleOutsideClick(event) {
      if (this.showDropdownMenu && !this.$el.contains(event.target)) {
        this.cssBtnBox.customBtn = 'close-btnVueti';
        this.cssBtnBox.icon = 'close';
        this.showDropdownMenu = false;
        this.searchTerm = '';
        this.cssDropdownBox = '';
        document.removeEventListener('click', this.handleOutsideClick);
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  }
});
