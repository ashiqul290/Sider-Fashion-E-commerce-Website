import React from 'react';
import { HeroCarousel } from './HeroCarousel';
import { useCart } from '../context/CartContext';

export const Hero: React.FC = () => {
  const { heroSlides } = useCart();
  return <HeroCarousel slides={heroSlides} autoplayInterval={4500} />;
};

export default Hero;
