import { defineComponent, watch, onUnmounted } from 'vue';
import { MicroApp } from './MicroApp';

export const MicroAppWithMemoHistory = defineComponent({
    components: {
        MicroApp
    },
    props: {
        name: {
            type: String,
            required: true
        },
        cacheName: String,
        settings: Object,
        props: Object,
        lifeCycles: Object,
        url: String
    },
    setup(props, { attrs }) {
        let microRouter;
        const onRouterInit = (router) => {
            microRouter = router;
            microRouter.push(props.url);
        };
        watch(
            () => props.url,
            () => {
                microRouter.push(props.url);
            }
        );
        onUnmounted(() => {
            microRouter = null;
        });
        return () => (
            <MicroApp
                onRouterInit={onRouterInit}
                {...props}
                {...attrs}
            ></MicroApp>
        );
    }
});
