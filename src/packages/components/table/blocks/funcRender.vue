<script>
import {
    defineComponent, h
} from 'vue';

export default defineComponent({
    name: 'FunctionRender',
    functional: true,
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        render: {
            type: Function,
            default: () => {}
        }
    },
    render: (ctx) => {
        const params = {
            data:ctx.data
        };

        return ctx.render(h, params);
    }
});
</script>
