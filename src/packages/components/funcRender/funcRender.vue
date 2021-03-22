<script>
import { defineComponent,h } from 'vue' 

export default defineComponent({
    name: "functionRender",
    functional: true,
    props: {
        data: Object,
        render: Function
    },
    render: (ctx) => {
        const params = {
            data:ctx.data
        };

        return ctx.render(h, params);
    }
});
</script>