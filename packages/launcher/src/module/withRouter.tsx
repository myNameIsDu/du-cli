import React, { Component, ComponentType, FC } from 'react';
import { Params, PathMatch, useLocation, useParams, useMatch } from 'react-router-dom';

import { useRouter, UseRouterReturns } from '../hooks';

type HocShape<P extends Record<string, unknown> = HocProps> = {
    (Com: ComponentType<P>): typeof Com extends Component<P> ? FC<P> : any;
};

type HocExtraProps = {
    location: Location;
    params: Params;
    match: PathMatch;
    history: {
        go: typeof history.go;
        goBack: typeof history.back;
        goForward: typeof history.forward;
        location: Location;
        push: UseRouterReturns['redirect'];
        replace: UseRouterReturns['replace'];
    };
};

export type HocProps = Record<string, unknown> & HocExtraProps;

const withRouter: HocShape = Com => {
    return (props: any) => {
        // eslint-disable-next-line no-underscore-dangle
        const _location = useLocation();
        const params = useParams();
        const router = useRouter();

        const match = useMatch({ path: '/*' });

        // eslint-disable-next-line no-underscore-dangle
        const _history = {
            go: window.history.go,
            goBack: window.history.back,
            goForward: window.history.forward,
            push: router.redirect,
            replace: router.replace,
            location: _location,
        };

        const extraProps = {
            match,
            params,
            location: _location,
            history: _history,
            ...props,
        };

        return <Com {...extraProps} />;
    };
};

export default withRouter;