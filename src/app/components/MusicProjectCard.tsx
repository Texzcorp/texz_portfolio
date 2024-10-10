import { Flex, Heading, Text, RevealFx } from '@/once-ui/components';
import MusicPlayer from './MusicPlayer';
import { MdOutlineMusicNote } from 'react-icons/md';

interface MusicProjectCardProps {
    href: string;
    image: string; // Une seule image plus petite à gauche
    title: string;
    description: string;
    mainMusic?: {
        src: string;
        title: string;
    }; // Musique principale avec nom
    extraMusics?: {
        src: string;
        title: string;
    }[]; // Musiques supplémentaires avec nom
}

export const MusicProjectCard: React.FC<MusicProjectCardProps> = ({
    href,
    image,
    title,
    description,
    mainMusic,
    extraMusics,
}) => {
    return (
        <Flex fillWidth gap="m" direction="row" alignItems="center" style={{ flexWrap: 'wrap' }}> 
            {/* Image à gauche (qui deviendra une icône en mode mobile) */}
            <Flex 
                style={{ 
                    flexBasis: '200px', 
                    flexShrink: 0, 
                    display: 'flex', 
                    alignItems: 'flex-start',
                }} 
                className="image-container"
            >
                <RevealFx
                    style={{width: '100%'}}
                    delay={0.25}
                    speed="slow"
                >
                    <img 
                        src={image} 
                        alt={title} 
                        style={{ width: '100%', borderRadius: '8px' }} 
                        className="project-image"
                    />
                </RevealFx>
            </Flex>
    
            {/* Contenu à droite : titre, description, lecteur de musique */}
            <Flex flex={1} direction="column" gap="s">
                <RevealFx
                    style={{width: '100%'}}
                    delay={0.25}
                    speed="fast"
                >
                    <Heading as="h3" variant="display-strong-xs">
                        <img 
                            src={image} 
                            alt={title} 
                            style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px', display: 'none' }} 
                            className="icon-image"  // Icône à gauche en mode mobile
                        />
                        {title}
                    </Heading>
                    <Text>{description}</Text>
                </RevealFx>
    
                {/* Lecteur de musique principal avec titre stylisé glassmorphism */}
                {mainMusic && (
                    <RevealFx
                        style={{width: '100%'}}
                        delay={0.02}
                        speed="slow"
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                {/* Icône placée à gauche du titre */}
                                <MdOutlineMusicNote 
                                    size={40}  // Taille de l'icône
                                    color="rgba(0, 255, 255, 0.7)" // Couleur cyan transparente
                                    style={{ marginRight: '5px', marginTop: '8px' }}  // Espacement entre l'icône et le titre
                                />
                                {/* Titre de la musique principale */}
                                <Text as="h4" style={glassTitleStyle}>
                                    {mainMusic.title}
                                </Text>
                            </div>
                            <MusicPlayer src={mainMusic.src} />
                        </div>
                    </RevealFx>
                )}
    
                {/* Lecteurs compacts pour les musiques supplémentaires avec leurs titres stylisés glassmorphism */}
                {extraMusics && extraMusics.length > 0 && (
                    <RevealFx
                        style={{width: '100%'}}
                        delay={0.25}
                        speed="slow"
                    >
                        <div style={{ marginTop: '16px' }}>
                            <Text>More in the same style :</Text>
                            <ul style={{ paddingLeft: '25px' }}>
                                {extraMusics.map((music, idx) => (
                                    <li key={idx} style={{ listStyleType: 'none', marginBottom: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                            {/* Icône de note de musique à gauche du titre */}
                                            <MdOutlineMusicNote 
                                                size={25}  // Taille plus petite pour l'icône
                                                color="rgba(0, 255, 255, 0.7)" // Couleur cyan transparente
                                                style={{ marginRight: '10px', marginTop: '8px' }}  // Espacement et centrage avec le titre
                                            />
                                            <Text as="h5" style={glassExtraTitleStyle}>
                                                {music.title}
                                            </Text>
                                        </div>
                                        {/* Lecteur de musique sur une nouvelle ligne avec espacement */}
                                        <div style={{ marginTop: '5px' }}>
                                            <MusicPlayer src={music.src} compact />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </RevealFx>
                )}
            </Flex>
        </Flex>
    );    
};

// Style pour les titres avec effet glassmorphism
const glassTitleStyle = {
    fontSize: '16px', // Taille un peu plus grande pour donner de l'importance
    fontWeight: '500', // Texte moyennement gras
    color: '#fff', // Texte blanc pour le contraste
    padding: '9px 15px', // Ajout de padding pour aérer le titre
    borderRadius: '18px', // Bords arrondis pour l'effet verre
    background: 'rgba(255, 255, 255, 0.02)', // Légère transparence
    backdropFilter: 'blur(5px)', // Effet de flou pour le fond
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Ombre douce pour l'effet de profondeur
    border: '1px solid rgba(255, 255, 255, 0.1)', // Bordure subtile pour définir les contours
    marginBottom: '0px', // Espace entre le titre et le lecteur
    marginTop: '10px', // Espace entre le titre et le lecteur
    textAlign: 'left' as 'left', // Alignement du texte à gauche
    display: 'inline-block', // Le fond suit la taille du texte
};

const glassExtraTitleStyle = {
    fontSize: '15px', // Taille un peu plus grande pour donner de l'importance
    fontWeight: '500', // Texte moyennement gras
    color: '#fff', // Texte blanc pour le contraste
    padding: '6px 16px', // Ajout de padding pour aérer le titre
    borderRadius: '18px', // Bords arrondis pour l'effet verre
    background: 'rgba(255, 255, 255, 0.02)', // Légère transparence
    backdropFilter: 'blur(5px)', // Effet de flou pour le fond
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Ombre douce pour l'effet de profondeur
    border: '1px solid rgba(255, 255, 255, 0.1)', // Bordure subtile pour définir les contours
    marginBottom: '0px', // Espace entre le titre et le lecteur
    marginTop: '10px', // Espace entre le titre et le lecteur
    textAlign: 'left' as 'left', // Alignement du texte à gauche
    display: 'inline-block', // Le fond suit la taille du texte
};

