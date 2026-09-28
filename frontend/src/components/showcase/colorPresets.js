export const LUXURY_COLOR_PRESETS = [
  { 
    name: 'Titanium Gray', 
    color: 'linear-gradient(135deg, #8a8d91 0%, #484b50 100%)', 
    hex: '#484b50',
    sampleImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Celestial Silver', 
    color: 'linear-gradient(135deg, #f5f5f7 0%, #a2a3a5 100%)', 
    hex: '#e2e3e5',
    sampleImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Midnight Black', 
    color: 'linear-gradient(135deg, #333336 0%, #161617 100%)', 
    hex: '#161617',
    sampleImage: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Desert Gold', 
    color: 'linear-gradient(135deg, #fcebc2 0%, #c8aa76 100%)', 
    hex: '#d4b988',
    sampleImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Pacific Blue', 
    color: 'linear-gradient(135deg, #60a5fa 0%, #1e3a8a 100%)', 
    hex: '#2563eb',
    sampleImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Alpine Green', 
    color: 'linear-gradient(135deg, #34d399 0%, #064e3b 100%)', 
    hex: '#047857',
    sampleImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Deep Purple', 
    color: 'linear-gradient(135deg, #c084fc 0%, #581c87 100%)', 
    hex: '#7e22ce',
    sampleImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Rose Gold', 
    color: 'linear-gradient(135deg, #fbcfe8 0%, #be185d 100%)', 
    hex: '#db2777',
    sampleImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Sunset Orange', 
    color: 'linear-gradient(135deg, #fdba74 0%, #c2410c 100%)', 
    hex: '#ea580c',
    sampleImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop'
  },
  { 
    name: 'Ceramic White', 
    color: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', 
    hex: '#f8fafc',
    sampleImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop'
  }
];

export const getDefaultColorGradient = (colorName = "") => {
  const c = (colorName || "").toLowerCase();
  if (c.includes('gray') || c.includes('titan') || c.includes('xám') || c.includes('رمادي')) {
    return 'linear-gradient(135deg, #8a8d91 0%, #484b50 100%)';
  }
  if (c.includes('silver') || c.includes('bạc') || c.includes('فضي')) {
    return 'linear-gradient(135deg, #f5f5f7 0%, #a2a3a5 100%)';
  }
  if (c.includes('black') || c.includes('đen') || c.includes('huyền') || c.includes('midnight') || c.includes('أسود')) {
    return 'linear-gradient(135deg, #333336 0%, #161617 100%)';
  }
  if (c.includes('gold') || c.includes('vàng') || c.includes('desert') || c.includes('ذهبي')) {
    return 'linear-gradient(135deg, #fcebc2 0%, #c8aa76 100%)';
  }
  if (c.includes('blue') || c.includes('xanh biển') || c.includes('pacific') || c.includes('أزرق')) {
    return 'linear-gradient(135deg, #60a5fa 0%, #1e3a8a 100%)';
  }
  if (c.includes('green') || c.includes('xanh lá') || c.includes('ngọc') || c.includes('أخضر')) {
    return 'linear-gradient(135deg, #34d399 0%, #064e3b 100%)';
  }
  if (c.includes('purple') || c.includes('tím') || c.includes('بنفسجي')) {
    return 'linear-gradient(135deg, #c084fc 0%, #581c87 100%)';
  }
  return 'linear-gradient(135deg, #5e6573 0%, #2f343f 100%)';
};
