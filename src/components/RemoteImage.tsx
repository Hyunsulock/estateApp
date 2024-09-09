import { Image } from 'react-native';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
  dataLink: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, dataLink, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!path) return;
    
    (async () => {
      
      const { data, error } = await supabase.storage
        .from(dataLink)
        .download(path);

      if (error) {
        console.log(error);
        setImage(path)
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) {
  }

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;
