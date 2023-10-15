const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();


function show_works( works )
{
    const gallery_container = document.querySelector( "#portfolio .gallery" );
    gallery_container.innerHTML = "";

    for( let index = 0; index < works.length; index++ )
    {
        const work = works[index];

        const figure_element = document.createElement( "FIGURE" );
        const img_element = document.createElement( "IMG" );
        const figcaption_element = document.createElement( "FIGCAPTION" );

        img_element.setAttribute( "src" ,work.imageUrl );
        img_element.setAttribute( "alt" ,work.title );

        figcaption_element.innerText = work.title;

        figure_element.appendChild( img_element );
        figure_element.appendChild( figcaption_element );

        gallery_container.appendChild( figure_element );
    }
}

function set_type_filter( type )
{
    const filters = document.querySelectorAll( ".filter-container .filter" );
    console.log(filters);

    for( let index = 0; index < filters.length; index++ )
    {
        const filter = filters[index];
        filter.classList.remove( "selected" );

        if( filter.classList.contains( `filter-${type}` ) )
        {
            filter.classList.add( "selected" );
        }
    }
}


const filter_all_list = document.querySelectorAll( ".filter-container .filter-all" );
const filter_object_list = document.querySelectorAll( ".filter-container .filter-object" );
const filter_apartment_list = document.querySelectorAll( ".filter-container .filter-apartment" );
const filter_hotel_restaurant_list = document.querySelectorAll( ".filter-container .filter-hotel-restaurant" );

for( let index = 0; index < filter_all_list.length; index++ )
{
    const filter_all = filter_all_list[index];
    
    filter_all.addEventListener(
        "click"
        ,()=>
            {
                set_type_filter( "all" );
                show_works( works );
            }
    );
}

for( let index = 0; index < filter_object_list.length; index++ )
{
    const filter_object = filter_object_list[index];
    
    filter_object.addEventListener(
        "click"
        ,()=>
            {
                set_type_filter( "object" );
                const works_filtered = works.filter(
                    function(work){
                        return work.category.name === "Objets";
                    }
                );
                show_works( works_filtered );
            }
    );
}

for( let index = 0; index < filter_apartment_list.length; index++ )
{
    const filter_apartment = filter_apartment_list[index];
    
    filter_apartment.addEventListener(
        "click"
        ,()=>
            {
                set_type_filter( "apartment" );
                const works_filtered = works.filter(
                    function(work){
                        return work.category.name === "Appartements";
                    }
                );
                show_works( works_filtered );
            }
    );
}

for( let index = 0; index < filter_hotel_restaurant_list.length; index++ )
{
    const filter_hotel_restaurant = filter_hotel_restaurant_list[index];
    
    filter_hotel_restaurant.addEventListener(
        "click"
        ,()=>
            {
                set_type_filter( "hotel-restaurant" );
                const works_filtered = works.filter(
                    function(work){
                        return work.category.name === "Hotels & restaurants";
                    }
                );
                show_works( works_filtered );
            }
    );
}

set_type_filter( "all" );
show_works( works );