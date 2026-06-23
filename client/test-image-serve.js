async function run() {
  try {
    const res = await fetch('http://localhost:5173/images/Aloo%20Paratha.avif');
    console.log(`Image Response Status: ${res.status}`);
    console.log(`Content-Type: ${res.headers.get('content-type')}`);
    console.log(`Content-Length: ${res.headers.get('content-length')}`);
  } catch (err) {
    console.error('Error requesting image:', err.message);
  }
}

run();
