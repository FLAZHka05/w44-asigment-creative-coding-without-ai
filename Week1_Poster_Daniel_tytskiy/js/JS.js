// Constants
// initilizing the canvas size and the number of rows and columns based on the cell size 
// for the grid of cells, colors, transparency ect... that will be drawn on the canvas. 
// The cell size is set to 40 pixels, and the number of rows and columns is calculated based on the height and width of the canvas divided by the cell size.


const Cell_size = 40; // Size of each cell in the grid in pixels
const Color_r = 79; // Red component of the color in the RGB color model
const Color_g = 38; // Green component of the color in the RGB color model
const Color_b = 233; // Blue component of the color in the RGB color model
const starting_alpha = 255; // Initial alpha (transparency) value
const background_color = 33; // Background color value
const prob_of_Neighbors = 0.5; // Probability of a cell being a neighbor
const AMT_Fade_per_frame = 5;
const stroke_weight = 1;


const imageUrls = [
/// why did i intitialize this variable ???? Becasue i want to keep track of the currently selected image index from the images array, 
// allowing for cycling through the images when the mouse is clicked. This variable will be used to determine which image to display on the canvas during the draw function.
    "../img/rave1.jpg",
    "../img/rave2.jpg"
].map(path => new URL(path, document.currentScript.src).href);
// reason why im initializing the imageUrls array here is to preload the images before the sketch starts. 
// This ensures that the images are available for use when the sketch is running along sside with preventing any delays or issues with loading images during the execution of the draw function. 
// By preloading the images, ÍT MAKESalso handle any errors that may occur during the loading process esier


/// why did i intitialize this variables ???? 
// YES to make sure that the images are preloaded before the sketch starts and knowing JS IT CAN BEHAVE REALY STRANGELY SOMETIMES ¨
// and alongside to give the starting points to all of the "thngs" that is needed to make the pointer cell tracker and image changes had evrything from start .


let colorWhiteAlpha; // colorWhiteAlpha  store a color with an alpha value for drawing the grid cells. Also set the stroke color of the grid cells allowing for transparency effects when drawing the cells on the canvas.
let numRows; //  numRows variable for storing the number of rows in the grid based on the canvas height and cell size. uses to determine the vertical layout of the grid and to ensure that the grid cells are drawn correctly within the canvas section.
let numCols; //  the numCols variable stores number of columns in the grid based on the canvas width and cell size. This aLLOWES to determine the horizontal layout of the grid and to ensure that the grid cells are drawn correctly within the canvas withd and hight.
let currentRow = -1;//  currentRow  keeps track of the current row index of the cell that the mouse is hovering over. It is set to -1 for indicating that no cell is currently selected or hovered over.
let currentCol = -1;// currentCol variable keeps track of the current column index of the cell that the mouse is hovering over. It is set to -1 to indicate that no cell is currently selected or hovered over.
let allNeighbors = [];//  will be used to determine the valid neighbors for each cell in the grid.
let images = [];//  holds the image objects loaded from the specified URLs or downloads allowing for easy access and manipulation of the images during the execution of the sketch.
let selectedImage = 0;// keeps track of the currently selected image index from the images array allowing for cycling through the images when the mouse is clicked.
const poster = document.querySelector(".poster");



function preload() { // preload() runs before the sketch starts so the background images can begin loading before draw() needs to display them.
    images = imageUrls.map((url, i) => { // tkaes the image url into and Array and goes through the array and builds a new array from the results. With help of map()
        const loadedImage = new Image(); // Creates an image object that the browser can load and later draw on the canvas
        loadedImage.onerror = () => console.error("Not showing " + (i + 1), url); // onerror https://www.w3schools.com/jsref/event_onerror.asp responds to an error 
        // while printing itt out in the console aand mkae the img sart at 1 instead of 0
        loadedImage.src = url; // Gives the browser the image path so it can start loading the image.
        return loadedImage; // Returns the loaded image object so it gets stored inside the images array.
    });
} // Closes the map() and preload() function after all image objects have been added to the array.


function setup() { // function for setting the canvas size, stroke ,color, calculation the cells, rows,columns based on the cell size and setting the image mode to center.
    createCanvas(poster.clientWidth, poster.clientHeight).parent(poster);
// DOM parent() element specifies the parent element in the HTML document where the canvas will be attached.
    colorWhiteAlpha = color(Color_r, Color_g, Color_b, starting_alpha); // colorWhiteAlpha hold the contants colors from the lines 1-15
    noFill();// standrat p5.js function that disables the fill color for shapes.
    strokeWeight(stroke_weight); // strokeWeight sets the thickness of the lines used for drawing shapes on the canvas.
    numRows = Math.ceil(height / Cell_size); // numRows calculates the number of rows in the grid based on the canvas height and cell size. It uses Math.ceil() to round up to the nearest whole number while aslo  ensuring that all cells fit within the canvas height.
    numCols = Math.ceil(width / Cell_size); // same thing but for the columns and width of the poster 
    imageMode(CENTER); // imageMode(CENTER) sets the image drawing mode to center of the page
} /// OBS THE reson why we want to round up with math ceil is to make sure that we have enough rows and columns to cover the entire canvas area
//Even if the canvas size are not perfectly divisible by the cell size. This prevents any gaps or empty spaces in the grid layout.

function draw() { // function that "draws"/ executes the logical part of the poster wile displaying a background image and a grid of cells that respond to mouse movements. 
// It also handles the fading effect of the neighboring cells and allows for cycling through different background images when the mouse is clicked.
    const currentImage = images[selectedImage]; // currentImages holds the selevted the fist image from the images array based on the selectedImage index. 
    //  While allowing displaying different background images when the mouse is clicked.
    if (currentImage && currentImage.width > 0 && currentImage.height > 0) { // if the currentImage is loaded and available, it will be displayed on the canvas.and in case of not loaded or unavailable it will display a background color(white) instead.
        const scale = Math.max( // simple math culculation to se how much the image must be scaled to fitt into canva
            width / currentImage.width, // takes the width of the canvas and divides it by the width of the current image to calculate the scaling factor needed to fit the image within the canvas width.
            height / currentImage.height // samt thing but for the hight of the canvas and current inmg aka culculating the scale factor for hieght 
        );
        drawingContext.drawImage( // Draws the selected background image directly onto the canvas and keeps it centered inside the poster.
            currentImage, // Uses the image that is currently selected from the images array.
            (width - currentImage.width * scale) / 2, // Calculates the x position so the scaled image is centered from left to right.
            (height - currentImage.height * scale) / 2, // Calculates the y position so the scaled image is centered from top to bottom.
            currentImage.width * scale, // Sets the displayed image width after scaling it to cover the canvas.
            currentImage.height * scale // Sets the displayed image height using the same scale so the image keeps its original shape.
        ); // Finishes drawing the background image on the canvas.
    } else { // if something goes wrong it will show the background color only 
        background(background_color);
    }

    const isMouseOnCanvas = mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height; // checking if the mouse is on canvas or no
    // mouseX checks if the mouse horizen position is relative to the canvas while mouseY doesn the same but for vertical position
    // OBS isMouseOnCanvas stores only the ruslting boolean values true or false 

    if (isMouseOnCanvas) { // condition taht runs only when the mouse is inside the canva for the cursore squer follow
        const row = Math.floor(mouseY / Cell_size); // first its declares the mouse index and devides the mouse vertical condition by its cell size 
        const col = Math.floor(mouseX / Cell_size);// first its declares the mouse index and devides the mouse horizontal condition by its cell size 
        // math. floor is used to result down to nearest int to figure out which grid cell the mouse is inside.
        if (row !== currentRow || col !== currentCol) { // condition to checks if the mouse had ebtred a difrent cell or not 
            currentRow = row; // Reasigning to a local value to make the program to rember its row
            currentCol = col;// Reasigning to a local value to make the program to rember its col
            allNeighbors.push(...getRandomNeighbors(row, col)); // calls the cells's cords
            ///... - spreads the syntax and passes the reurn array's element induvidualy 
            // while whitout ... would add the whole array instead and created an a nested array instead and distructre the whole animation
        }

        stroke(colorWhiteAlpha); // sets the outline coloer
        rect(col * Cell_size, row * Cell_size, Cell_size, Cell_size); // rect draws the position while the whole multiplication convirts the cords into px cords 
    } else { // inf the mous is otside the canva  it will rest the tracking and when the mouse returns the next cell is detected as a new 
        currentRow = -1;
        currentCol = -1;
    }

    for (const neighbor of allNeighbors) { // checks the closest Neighbors while referint to the current array item in each iteration 
        neighbor.opacity = Math.max(0, neighbor.opacity - AMT_Fade_per_frame); // Neighbors.opasity reads and updates the objects opacity and then subtracts the frames while 
        // AMT_Fade_per_frame - how much a cell's opacity decreases during each frame of the animation.
        // Math max prevents it from falling under 0 and if it would have done it, it would have broke the animation 
        stroke(Color_r, Color_g, Color_b, neighbor.opacity); // configuration the color of the cell aka squer and its opacity 
        rect( // draws the cell at the cords that are stored in the object while stroke() opacity is slightly fading away 
            neighbor.col * Cell_size,
            neighbor.row * Cell_size,
            Cell_size,
            Cell_size
        );
    }
    allNeighbors = allNeighbors.filter(neighbor => neighbor.opacity > 0); // removes the faded cells from the animation 
    // fliter() filters/cre
    // while keeping the the cells that are grater than 0 and removing other cell with 0 opacity 
    // Which make the  invisible cells to not continue to process further on  
}

function getRandomNeighbors(row, col) {// randomizing the surroundrings where row and col recives the current cells cords undernieght the mouse 

    const neighbors = []; // to storing the neighbors around the mouse 

    for (let dRow = -1; dRow <= 1; dRow++) { //dRow= means the row difference/offset . -1= the row above, 0= current row  1= row below, ++ = increasing the value by one
        for (let dCol = -1; dCol <= 1; dCol++) { // dCol= difrences/offsett between the colums, -1 = leftr column, 0 current column, 1= right colum 
            //Column loop is inside the row loop it will run 3 times for very rows which means tha the loops togheter examines 9 closets squers/cells  around it  
            const neighborRow = row + dRow; // culculation the row canditaes around the neighbors cell 
            const neighborCol = col + dCol;// culculation the columns canditaes around the neighbors cell 
            const isCurrentCell = dRow === 0 && dCol === 0; // This lets the line exclude the cell beneath the mouse from the list of neighbors. if the ther is no offsets in ROW and COl 
            // which means that the both conditions needs to be true
            const isInBounds =neighborRow >= 0 &&neighborRow < numRows &&neighborCol >= 0 &&neighborCol < numCols;
            //neighborRow >= 0 prevents from row to fall under 0  othrwise error
            //neighborRow < numRows prevents rows to be beyonnd the last row
            //prevents the colum to fall under 0  otherwise error
            //neighborCol < numCols numcol prevents colums to be beyonnd the last column


            if (!isCurrentCell && isInBounds && random() < prob_of_Neighbors) // Celects a new candidate for the animatiopn only when this conditions are true
            //!isCurrentCell && isInBounds the candidate is not same cell, while not being in same grid  ! = means NO/NOT
            // random() < prob_of_Neighborsthe random vlaue should not be below probability treshold 

                {
                    neighbors.push({ // pushes all the neighbors info iunto the array 
                        row: neighborRow,
                        col: neighborCol,
                        opacity: starting_alpha
                    });
                }
        }
    }

    return neighbors; // returnns the arrays to the function allNeighbors.push(...)
}

function mouseClicked() {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height && images.length > 1) { // the condition checks if there are more than 1 loaded-images inside  in the array.  
    // Along side with if the mouse is inside the canva or no 
    // mouseX >= 0 - if the mouse is at or to the right of the canvas's left edge.
    //  mouseX < width - checks is user mouse is inside the horizontal side of the poster 
    // mouseY >= 0 - checks if mouse is or bellow the canvas top edges 
    // mouseY < height checks if the mouse is inside the vertical side of cnava 
    // withj other words this line of code ensure that the mouse click is inside the canvas boundaries.

        selectedImage = (selectedImage + 1) % images.length;
    }
}

function windowResized() {
    resizeCanvas(poster.clientWidth, poster.clientHeight);
    numRows = Math.ceil(height / Cell_size);// Culculates  number of rows based on the current canvas height and cell size.
    numCols = Math.ceil(width / Cell_size);// // Culculates  number of Columsn based on the current canvas widtht and cell size.
    allNeighbors = [];
    currentRow = -1;// Resets the tracked row to indicate that no cell is currently being tracked.
    currentCol = -1; // doesn same thing 

}
// https://www.youtube.com/watch?v=bI6v2DgpZwM
//