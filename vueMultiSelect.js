var VueMultiSelect = Vue.component('VueMultiSelect', {
  template:`
<div id="VueMultiSelect" class="dropdown">
    <button :class="cssBtnBox.btn" type="button" @click="toggleDropdown()" @mouseenter="changeIconBtn(true)"
        @mouseleave="changeIconBtn(false)">
        {{ selectedOptions.length === 0 ? 'Nenhuma opção selecionada' : selectedOptions.join(', ') }}
        <i class="fas fa-chevron-right caret-icon" :class="cssBtnBox.icon"></i>
    </button>
    <div :class="cssDropdownBox">
        <div class="search-box" v-show="showDropdown">           
                <button class="search-icon" type="button" >
                    <i class="fas fa-search"></i>
                </button>            
            <input type="text" v-model="searchTerm" placeholder="Pesquisar" class="search-bar" />          
                <button class="clear-button icon-clearbutton" type="button" @click="clearSearch">
                    <i class="fas fa-times"></i>
                </button>           
        </div>
        <div class="dropdown-menu">
            <ul v-show="showDropdown">
                <li v-for="group in filteredOptions" :key="group.name">
                    <div class="group-header">
                        <label class="checkbox-label">
                            <input type="checkbox" v-model="selectedOptions" :value="group.name"
                                class="form-check-input select-all-checkbox" />
                            {{ group.name }}
                        </label>
                        <button class="group-toggle-button" type="button" @click="toggleGroup(group)">
                            <i class="fas" :class="group.expanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                        </button>
                    </div>
                    <ul v-show="group.expanded">
                        <li v-for="object in group.objects" :key="object">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="selectedOptions" :value="object"
                                    class="form-check-input" />
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
      ],
      selectedOptions: [],
      searchTerm: '',
      showDropdown: false,
      cssBtnBox: {
        btn: 'btn-close-multiselect',
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
      this.showDropdown = !this.showDropdown;
      if (this.showDropdown) {
        this.cssBtnBox.btn = 'btn-open-multiselect';
        this.cssDropdownBox = 'dropdown-box';
        document.addEventListener('click', this.handleOutsideClick);        
      } else {
        this.cssBtnBox.btn = 'btn-close-multiselect';
        this.cssDropdownBox = '';
        document.removeEventListener('click', this.handleOutsideClick);
      }
    },
    changeIconBtn(value) {
      if (this.showDropdown) {
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
      if (this.showDropdown && !this.$el.contains(event.target)) {
        this.cssBtnBox.btn = 'btn-close-multiselect';
        this.cssBtnBox.icon = 'close';
        this.showDropdown = false;
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
