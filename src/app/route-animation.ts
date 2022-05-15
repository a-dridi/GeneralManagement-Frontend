import {
    transition,
    trigger,
    query,
    style,
    animate,
    group
} from '@angular/animations';

export const slideInAnimation =
    trigger('globalRouteAnimations', [
        transition('Decision => Decision-Edit', [
            query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
            group([
                query(':enter', [
                    style({ transform: 'translateX(0%)' }),
                    animate('0s ease-in-out', style({ transform: 'translateX(0%)' }))
                ], { optional: true }),
                query(':leave', [
                    style({ transform: 'translateX(0%)' }),
                    animate('0s ease-in-out', style({ transform: 'translateX(0%)' }))
                ], { optional: true }),
            ])
        ]),
        transition('* => *', [
            query(':enter', [style({ opacity: 0 })], { optional: true }),
            query(
                ':leave',
                [style({ opacity: 1 }), animate('0.1s', style({ opacity: 0 }))],
                { optional: true }
            ),
            query(':enter', [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))], { optional: true })
        ]),
    ]);