import { useEffect } from 'react';

export const useTitle = (title) => {

    useEffect(() => {

        const prevTitle = document.title;
        document.title = title + ' - HumanID';

        return () => {
            document.title = prevTitle
        }
    });

};