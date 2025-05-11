import React from 'react';

const Copyright = () => {
    return (
        <footer style={styles.footer}>
            <p>© 2024 BLISS MONEY. Tous droits réservés.</p>
        </footer>
    );
};

const styles = {
    footer: {
        /*  position: 'fixed', */
        bottom: 0,
        width: '100%',
        /* backgroundColor: '#f8f9fa',  */// Couleur de fond
        textAlign: 'center',
        padding: '10px 0',
        /* boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', */ // Effet d'ombre
    }
};

export default Copyright;
