export default function testFunc() {
    console.log('-----------------start');

    greeters();
    es6();

    console.log('-----------------end');
}

function es6() {
    // string解构
    const str = 'eeee',
        {length} = str;
    console.log(str.length);
    console.log(length)

    let [first, ...rest] = [1, 2, 3, 4];
    console.log(first); // outputs 1
    console.log(rest); // outputs [ 2, 3, 4 ]
    console.log(...rest); // outputs 2 3 4
    // 对象解构
    const obj = {
            a: 'eee',
            b(){
                console.log(this,this.a);
            }
        },
        objClone = {...obj};
        console.log(objClone);
        console.log(objClone.b())
    // 对象解构注意点，它仅包含对象 自身的可枚举属性。 大体上是说当你展开一个对象实例时，你会丢失其方法
    class C {
        p = 12;
        m() {
            console.log(this.p);
        }
    }
    let c = new C();
    let clone = { ...c };
    console.log(clone)
    // clone.p; // ok
    // clone.m(); // error!

}


// 在构造函数的参数上使用public等同于创建了同名的成员变量
function greeters() {
    class Student {
        fullName: string;
        constructor(public firstName:string, public middleInitial:string, public lastName:string) {
            this.fullName = firstName + " " + middleInitial + " " + lastName;
        }
    }
    
    interface Person {
        firstName: string;
        lastName: string;
    }
    
    function greeter(person : Person) {
        return "Hello, " + person.firstName + " " + person.lastName;
    }
    
    let user = new Student("Jane", "M.", "User");

    console.log(user)
    // {
    //     firstName: "Jane"
    //     fullName: "Jane M. User"
    //     lastName: "User"
    //     middleInitial: "M."
    // }
    console.log(greeter(user))//Hello, Jane User
}
