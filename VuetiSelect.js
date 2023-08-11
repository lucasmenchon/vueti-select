var VuetiSelect = Vue.component("VuetiSelect", {
  template: `
  <div id="VuetiSelect" class="vuetiSelectBox">
  <div class="dropdownContainer">
    <div class="buttonBox">
      <button type="button" :class="cssBtnBox.customBtn" @click="toggleDropdown()">
        <span>{{ selectedOptions.length === 0 ? 'Nenhuma opção selecionada' : selectedOptions.join(', ') }}</span>
        <i :class="cssBtnBox.icon"></i>
    </div>
    <transition name="fade">
      <div v-if="showDropdownMenu" :class="cssDropdownMenu">
        <div class="searchBox">
          <div class="svgSearchBox">
            <i class="svgSearch"></i>
          </div>
          <input type="text" v-model="searchTerm" placeholder="Pesquisar" class="searchBar" />
          <button class="clearButton" type="button" @click="clearSearch">
            <i class="svgEraser"></i>
          </button>
        </div>
        <div :class="cssUlBox">
          <ul class="ulMenu">
            <li>Selecionar tudo</li>
            <li v-for="group in filteredOptions" :key="group.name">
              <div class="">
                <label class="">
                  <input type="checkbox" v-model="selectedOptions" :value="group.name" />
                  {{ group.name }}
                </label>
                <button type="button" @click="toggleGroup(group)" class="checkboxButton">
                  <i :class="group.cssCheckbox"></i>
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
    </transition>
  </div>
</div>
  `,

  data() {
    return {
      groups: [
        {
          name: "Clothing",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Pants", "Shirt", "Jacket"],
        },
        {
          name: "Accessories",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Glasses", "Cap", "Necklace"],
        },
        {
          name: "Food",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Fruits", "Vegetables", "Meat"],
        },
        {
          name: "Electronics",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Smartphone", "Laptop", "Headphones"],
        },
        {
          name: "Books",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Fiction", "Non-Fiction", "Self-Help"],
        },
        {
          name: "Sports",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Ball", "Racket", "Tennis"],
        },
        { name: "Home", expanded: false, objects: ["Sofa", "Table", "Chair"] },
        {
          name: "Beauty",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Makeup", "Cream", "Perfume"],
        },
        {
          name: "Toys",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Doll", "Car", "Ball"],
        },
        {
          name: "Games",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Board Game", "Cards", "Video Game"],
        },
        {
          name: "Tools",
          expanded: false,
          cssCheckbox: "svgArrow",
          objects: ["Hammer", "Screwdriver", "Saw"],
        },
      ],
      selectedOptions: [],
      searchTerm: "",
      showDropdownMenu: false,
      cssBtnBox: {
        customBtn: "close-btnVueti",
        icon: "svgCaretDown closed",
      },
      cssUlBox: "",
      cssDropdownMenu: "dropdownMenu",
      cssCheckbox: "svgArrow closed",
      isMouseOver: false,
    };
  },
  computed: {
    filteredOptions() {
      return this.groups.filter(
        (group) =>
          group.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          group.objects.some((object) =>
            object.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
      );
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdownMenu = !this.showDropdownMenu;
      if (this.showDropdownMenu) {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "open-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown open";
        this.cssUlBox = "ulBox";
        document.addEventListener("click", this.handleOutsideClick);
      } else {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "close-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown closed";
        this.cssUlBox = "";
        this.searchTerm = "";
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },

    clearSearch() {
      this.searchTerm = "";
    },

    toggleGroup(group) {
      group.expanded = !group.expanded;
      if(group.expanded){
        group.cssCheckbox = "svgArrow open";
      } else{
        group.cssCheckbox = "svgArrow";
      }
    },

    handleOutsideClick(event) {
      if (this.showDropdownMenu && !this.$el.contains(event.target)) {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "close-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown closed";
        this.cssUlBox = "";
        this.searchTerm = "";
        this.showDropdownMenu = false;
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
});
