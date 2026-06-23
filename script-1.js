//const greetingSpan=document.getElementById("header"),Hours=new Date().getHours();let msg="";function showtime(){document.getElementById("current-time").innerHTML=new Date().toLocaleTimeString("en-Us",{hour12:!0})}function getLiveWeather(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(e=>{let t=e.coords.latitude,n=e.coords.longitude,r=`https://api.open-meteo.com/v1/forecast?latitude=${t}&longitude=${n}&current_weather=true&temperature_unit=fahrenheit`;fetch(r).then(e=>e.json()).then(e=>{let t=Math.round(e.current_weather.temperature);document.getElementById("current-weather").innerHTML=` | 🌤️ ${t}\xb0F`}).catch(()=>{document.getElementById("current-weather").innerHTML=` | 🌍 Weather unavailable`})})}msg=Hours<12?"☀GOOD MORNING MS WHITCOMB":Hours<18?"GOOD AFTERNOON  MS WHITCOMB":"GOOD NIGHT MS WHITCOMB",greetingSpan.textContent=msg,showtime(),setInterval(function(){showtime()},1e3),getLiveWeather();
const imageUploader = document.getElementById('image-uploader');
const galleryDisplay = document.getElementById('gallery-display-area');

// 🛠️ Function to create the image container with its X button
function createImageBox(imgSrc, indexToRemove) {
  const container = document.createElement('div');
  container.className = "image-container";

  // Create the image
  const newImg = document.createElement('img');
  newImg.src = imgSrc;
  newImg.className = "gallery-photo";
  
  // 🌐 Direct tap/click opens the image in a new blank tab
  newImg.addEventListener('click', () => {
    const w = window.open();
    w.document.title = "View Image";
    w.document.body.style.margin = "0";
    w.document.body.style.backgroundColor = "#111"; 
    
    const img = w.document.createElement('img');
    img.src = imgSrc;
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "20px auto";
    img.style.borderRadius = "8px";
    
    w.document.body.appendChild(img);
  });
  // ❌ Create the X delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = "delete-btn";
  deleteBtn.innerText = "×";

  // Delete logic when X is clicked
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the image click from triggering
    container.remove();
    
    let savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    
    if (indexToRemove !== undefined) {
      savedImages.splice(indexToRemove, 1);
    } else {
      savedImages = savedImages.filter(item => item !== imgSrc);
    }
    
    localStorage.setItem('galleryImages', JSON.stringify(savedImages));
    location.reload(); // Smoothly resets tracking numbers
  });

  container.appendChild(newImg);
  container.appendChild(deleteBtn);
  galleryDisplay.appendChild(container);
}

// ⏳ Load saved photos on page refresh
window.addEventListener('DOMContentLoaded', () => {
  const savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
  savedImages.forEach((imgSrc, index) => createImageBox(imgSrc, index));
});

// 📸 Upload new photos
imageUploader.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const targetSrc = e.target.result;
      
      createImageBox(targetSrc); // Display immediately
      
      const savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
      savedImages.push(targetSrc);
      localStorage.setItem('galleryImages', JSON.stringify(savedImages));
    };
    reader.readAsDataURL(file);
  }
});
