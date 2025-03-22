<template>
    <div class="func-menu-container func-nowrap">
        <div class="func-menu-trigger" @click.stop="onToggleMenu" >
            <slot name="caption">Menu</slot>
        </div>
        <div class="func-menu-dropdown" :style="{'max-width': menuMaxWidth?menuMaxWidth:'350px' }" v-if="menuOpen" @click.stop="menuOpen = false">
            <div class="func-menu-filter-outer">
                <input type="text" class="func-menu-filter-text" placeholder="Type to filter..."
                    v-model="filterText"
                    @click.stop @keydown.escape="filterText=''"
                    :ref="menuId + '-filterText'" />
                <div class="func-menu-filter-clear" @click.stop="clearFilterText" title="Clear Filter">
                    <font-awesome-icon :icon="['far', 'circle-xmark']" />
                </div>
            </div>
            <div class="func-menu-dropdown-item"
                v-for="menuItem in filteredMenuItems"
                :key="menuItem.key"
                @click="onItemClick(menuItem.key)" v-html="render(menuItem)"></div>
            <div class="func-menu-dropdown-item-empty" v-if="menuItems.length == 0">{{ noDataCaption }}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['menuId', 'menuMaxWidth',
        'caption', 'menuItems', 'noDataCaption',
        'itemRenderer',
        'searchTextRenderer'
    ], //Menu Items should have key. Default render will be "key: title" and default search will be in key and title.
    data(){
        return {
            menuOpen: false,
            filterText: ''
        };
    },
    methods: {
        triggerFocusFilterText(){
            //Place focus in filter textbox
            this.$nextTick(() => {
                const refText = this.menuId + '-filterText';
                this.$refs[refText].focus();
            });
        },
        render(menuItem){
            return this.itemRenderer ? this.itemRenderer(menuItem) : this.defaultRender(menuItem);
        },
        searchRender(menuItem){
            return this.searchTextRenderer ? this.searchTextRenderer(menuItem) : this.defaultRender(menuItem).toLowerCase();
        },
        defaultRender(menuItem){
            return `${menuItem.key}: ${menuItem.title}`;
        },
        clearFilterText(){
            this.filterText = '';
            this.triggerFocusFilterText();
        },
        onItemClick(itemKey){
            this.$emit('item-click', itemKey);
        },
        onToggleMenu(){
            this.menuOpen = !this.menuOpen;
            if(this.menuOpen){
                this.triggerFocusFilterText();

                //Set a handler for clicks outside the menu
                var clickOutsideEventHandler = (event) => {
                    this.menuOpen = false;
                    event.preventDefault();
                };
                document.body.addEventListener('click',
                    clickOutsideEventHandler,
                    { once: true }
                );
            }
        }
    },
    computed:{
        filteredMenuItems(){
            if (this.filterText) {
                const keywords = this.filterText.toLowerCase().split(' ');
                return this.menuItems.filter((item) => {
                    const itemText = this.searchRender(item);
                    return keywords.every(keyword => itemText.includes(keyword));
                });
            } else {
                return this.menuItems;
            }
        }
    }
}
</script>