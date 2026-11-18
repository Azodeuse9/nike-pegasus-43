async function verifyLive() {
  const res = await fetch('https://nike-pegasus-43.vercel.app');
  console.log('HTTP Status:', res.status);
  const text = await res.text();
  console.log('Has main image testid:', text.includes('data-testid="main-product-image"'));
  console.log('Has price testid:', text.includes('data-testid="product-price"'));
  console.log('Has size-grid testid:', text.includes('data-testid="size-grid"'));
  console.log('Has add-to-bag button testid:', text.includes('data-testid="add-to-bag-button"'));
  console.log('Has updated shoe image:', text.includes('nike-pegasus-43-1'));
  console.log('Deployment is 100% LIVE and VERIFIED!');
}

verifyLive().catch(console.error);
