import React from 'react';

import { useTitle } from '../hooks/use-title';

import { useParams } from 'react-router-dom';

import { Page } from '../components/UI/Page';
import ShareList from '../components/ShareList';
import AccessesList from '../components/AccessesList';


const ListPage = () => {

    useTitle('List');

    const { category } = useParams();


    return (
        <Page>
            {category === 'shares' &&
                <ShareList />
            }
            {category === 'acceses' &&
                <AccessesList />
            }
        </Page>
    )
}

export default ListPage